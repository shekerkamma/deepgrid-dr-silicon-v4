// Multi-page delivery gate. The old verify-site.mjs was written for the hash-routed SPA and
// checks one document; this checks that every route declared in app/routes.ts is a real page
// that loads, carries the right base, and links only within it.
//
// It exists because `vinext build` reports an unprerendered route as "skipped" and still exits
// 0 — a green build silently shipped without /applications and /evidence once already.
//
// Usage: node scripts/verify-routes.mjs <base-url> [shot-dir]
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = (process.argv[2] || '').replace(/\/?$/, '/');
const shots = process.argv[3];
if (!site.startsWith('http')) { console.error('usage: verify-routes.mjs <base-url> [shot-dir]'); process.exit(1); }

const routeSrc = fs.readFileSync(path.join(root, 'app/routes.ts'), 'utf8');
const declared = [...routeSrc.matchAll(/href:\s*'([^']+)'/g)].map(m => m[1]);
if (declared.length < 8) { console.error(`Only ${declared.length} routes parsed from app/routes.ts`); process.exit(1); }

const basePath = new URL(site).pathname;
const fails = [];
const browser = await chromium.launch();

// Third pass at phone width with reduced motion forced. A scroll-driven page that only
// reveals content through animation shows nothing at all to a reader who has motion off.
for (const [width, reduced] of [[1440, false], [390, false], [390, true]]) {
  const page = await browser.newPage({viewport: {width, height: 900}, reducedMotion: reduced ? 'reduce' : 'no-preference'});
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140)); });

  for (const route of declared) {
    const url = site + (route === '/' ? '' : route.replace(/^\//, '') + '.html');
    const before = errors.length;
    const resp = await page.goto(url, {waitUntil: 'networkidle'});
    await page.waitForTimeout(500);
    // Scroll the whole page so entrance animations resolve; a block stuck at opacity 0 is
    // invisible to a screenshot but is a real reader-facing defect.
    // Scroll the page through twice. The reveal observer is installed by a React effect, so on a
    // cold load of a heavy route (the architecture page carries a WebGL canvas) a single scripted
    // pass can finish before the effect mounts: the observer then starts at y=0 with everything
    // below the fold still pending, and nothing else moves the page. Measured on /technology,
    // 16 of 20 blocks unrevealed on run 1 and 0 on runs 2 and 3. A real reader scrolls again, so
    // the gate does too, and a block that is still hidden after the second pass is genuinely stuck.
    const sweep = async () => {
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 700) { await page.evaluate(v => scrollTo({top: v, behavior: 'instant'}), y); await page.waitForTimeout(60); }
      // End on the true bottom and let two frames run before leaving. The reveal sweep runs in a
      // requestAnimationFrame after the scroll event; under load (42 checks back to back) that frame
      // can land after a fixed 60ms wait, so the sweep sampled the page already back at y=0 and the
      // blocks revealable only from the last position never got rv-in. Measured on /company: leave
      // the bottom in the same frame and its two closing blocks stick 2/2; hold two frames, 0/2. A
      // reader at the bottom always stays longer than two frames, so this measures the reader.
      await page.evaluate(async () => {
        scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'});
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
    };
    await sweep();
    await sweep();
    // Entrance delays run to 700ms via data-rv-delay, and on a page with a live WebGL canvas a
    // starved renderer can park a transition for seconds. A single sample at a fixed moment
    // therefore measures the animation, not the outcome: the same unchanged page reported 7
    // blocks hidden at 250ms, 0 at 800ms, and intermittently 2 at 1000ms. Poll for the settled
    // state instead, and only fail when it never settles.
    await page.waitForFunction(
      () => [...document.querySelectorAll('[data-rv]')].every(e => parseFloat(getComputedStyle(e).opacity) >= 0.99),
      null, {timeout: 6000},
    ).catch(() => {});

    const d = await page.evaluate(bp => ({
      base: document.querySelector('meta[name="site-base"]')?.getAttribute('content'),
      offBase: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')).filter(h => !h.startsWith(bp)),
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
      // Two different failures: never got the class (the observer missed it) versus still
      // transparent after settling (the transition never ran).
      neverRevealed: [...document.querySelectorAll('[data-rv]')].filter(e => !e.classList.contains('rv-in')).length,
      stillHidden: [...document.querySelectorAll('[data-rv]')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      title: document.title,
      nav: document.querySelectorAll('.main-nav a').length,
      // WCAG 2.5.8: interactive targets need 24x24 CSS px. Checked at phone width, where
      // a control tuned for a pointer is most likely to be too small for a thumb.
      smallTargets: [...document.querySelectorAll('a, button, input, summary, [role="button"]')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24); })
        // 2.5.8 exempts a target "in a sentence or block of text". The test is whether the
        // parent has prose of its own AROUND the link, which means its own direct text nodes --
        // not merely a longer textContent, since a footer row of sibling <span>s would pass that
        // and a footer link is a standalone target, not a word in a sentence.
        .filter(e => {
          if (e.tagName !== 'A') return true;
          const p = e.parentElement;
          if (!p) return true;
          const ownProse = [...p.childNodes]
            .filter(n => n.nodeType === 3)
            .map(n => n.textContent.trim())
            .join('');
          return ownProse.length === 0;
        })
        .map(e => (e.tagName.toLowerCase() + '.' + String(e.className || '').split(' ')[0]).slice(0, 44))
        .slice(0, 6),
    }), basePath);

    const problems = [];
    if (resp.status() !== 200) problems.push('status ' + resp.status());
    if (d.base !== basePath) problems.push(`site-base "${d.base}" != "${basePath}"`);
    if (d.offBase.length) problems.push('links outside base: ' + d.offBase.slice(0, 3).join(', '));
    if (d.brokenImgs.length) problems.push('broken images: ' + d.brokenImgs.slice(0, 3).join(', '));
    if (d.neverRevealed) problems.push(`${d.neverRevealed} block(s) never got rv-in`);
    if (d.stillHidden) problems.push(`${d.stillHidden} block(s) still transparent after settling`);
    if (d.overflowX) problems.push('horizontal overflow');
    if (!d.nav) problems.push('no primary nav');
    if (width === 390 && d.smallTargets.length) problems.push('tap targets under 24px: ' + d.smallTargets.join(', '));
    if (errors.length > before) problems.push(errors.slice(before, before + 2).join(' | '));

    const tag = `${width === 390 ? (reduced ? 'reduced' : 'phone  ') : 'desktop'} ${route}`;
    if (problems.length) { fails.push(`${tag}: ${problems.join('; ')}`); console.log(`FAIL ${tag}: ${problems.join('; ')}`); }
    else console.log(`ok   ${tag}  ${d.title.slice(0, 60)}`);

    if (shots) {
      fs.mkdirSync(shots, {recursive: true});
      // Viewport, not fullPage. A full-page capture of a reveal-on-scroll page renders the
      // blocks that have not been scrolled to yet as blank and the counters at zero, so it shows
      // a broken page that is not broken. It also times out on /ask, which carries a 1.5 MB graph.
      await page.screenshot({
        path: path.join(shots, `${width}${reduced ? '-rm' : ''}-${(route === '/' ? 'home' : route.slice(1)).replace(/\//g, '-')}.png`),
        timeout: 15000,
      }).catch(err => console.log(`     (screenshot skipped for ${route}: ${err.message.split('\n')[0]})`));
    }
  }
  await page.close();
}
await browser.close();

if (fails.length) { console.error(`\n${fails.length} check(s) failed.`); process.exit(1); }
console.log(`\nALL ROUTES PASS (${declared.length} routes x desktop, phone, phone+reduced-motion)`);
