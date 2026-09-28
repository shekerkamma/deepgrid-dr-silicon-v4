// Navigation gate: drives every menu the way a person does, and every page by the URLs people type.
// Added after /About 404'd and the About dropdown closed before the pointer reached its links.
//   node scripts/verify-nav.mjs [base-url]
// 1. desktop: hover each dropdown, travel the pointer to EVERY link in its panel, click, land on that page
// 2. desktop: click-to-open, Escape closes and returns focus, keyboard Enter opens and Tab reaches a link
// 3. narrow desktop (1024px): every panel stays inside the viewport
// 4. phone: open the sheet, expand each group, follow every link
// 5. URL variants: /About, /about/, /about.html, /use-cases, /software all reach a real page
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8768/deepgrid-dr-silicon-v3/';
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL ' + m); };
const path = (u) => new URL(u, BASE).pathname.replace(/\/$/, '');
const b = await chromium.launch();

async function landed(p, want, via) {
  await p.waitForURL((u) => path(u.toString()) === want, { timeout: 15000 }).catch(() => {});
  const got = path(p.url()).replace(/\.html$/, ''); // Pages serves /x.html as the same page as /x
  let h = { h1: '', nf: false };
  for (let t = 0; t < 4; t++) {
    await p.waitForLoadState('networkidle').catch(() => {});
    try { h = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim() || '', nf: !!document.querySelector('.nf-page') })); break; }
    catch { await p.waitForTimeout(500); } // a redirect was still in flight
  }
  if (got !== want || !h.h1 || h.nf) fail(`${via}: wanted ${want}, got ${got} (h1 "${h.h1}"${h.nf ? ', not-found page' : ''})`);
}

// 1-2. desktop pointer and keyboard
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + 'contact', { waitUntil: 'networkidle' });
  const menus = await p.$$eval('.site-header .mega-trigger, header .mega-trigger, nav.mega-nav .mega-trigger', (xs) =>
    [...new Set(xs.map((x) => x.getAttribute('aria-controls')))]);
  let followed = 0;
  for (const id of menus) {
    await p.goto(BASE + 'contact', { waitUntil: 'networkidle' });
    const hrefs = await p.$$eval(`#${id} a`, (as) => as.map((a) => a.href));
    for (const [href, target] of await p.$$eval(`#${id} a`, (as) => as.map((a) => [a.href, a.target])))
      if (new URL(href).origin !== new URL(BASE).origin && (!/^https:\/\/(www\.)?youtube\.com\/@DeepgridSemi/.test(href) || target !== '_blank'))
        fail(`menu ${id}: external link ${href} (target ${target || 'self'})`);
    for (let i = 0; i < hrefs.length; i++) {
      if (new URL(hrefs[i]).origin !== new URL(BASE).origin) continue; // external: checked above, not followed
      if (i) await p.goto(BASE + 'contact', { waitUntil: 'networkidle' });
      const btn = p.locator(`[aria-controls="${id}"]`).first();
      const bb = await btn.boundingBox();
      await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await p.waitForTimeout(150);
      const link = p.locator(`#${id} a`).nth(i);
      if (!(await link.isVisible())) { fail(`hover ${id}: panel did not open`); break; }
      const lb = await link.boundingBox();
      // a straight, human-speed path from the button to the link, however far apart they are
      await p.mouse.move(lb.x + Math.min(24, lb.width / 2), lb.y + lb.height / 2, { steps: 30 });
      if (!(await link.isVisible())) { fail(`hover ${id}: panel closed before the pointer reached "${(await link.textContent()).slice(0, 40)}"`); continue; }
      await p.mouse.down(); await p.mouse.up();
      await landed(p, path(hrefs[i]), `menu ${id} -> link ${i + 1}`);
      followed++;
    }
    // click opens, Escape closes and returns focus to the button
    await p.goto(BASE + 'contact', { waitUntil: 'networkidle' });
    await p.mouse.move(5, 890);
    const btn = p.locator(`[aria-controls="${id}"]`).first();
    await btn.focus(); await p.keyboard.press('Enter');
    if (!(await p.locator(`#${id}`).isVisible())) fail(`keyboard ${id}: Enter did not open the panel`);
    await p.keyboard.press('Tab');
    const inPanel = await p.evaluate((id) => !!document.activeElement?.closest('#' + id), id);
    if (!inPanel) fail(`keyboard ${id}: Tab from the open button did not reach its first link`);
    await p.keyboard.press('Escape');
    const state = await p.evaluate((id) => ({ open: !document.getElementById(id).hidden, focus: document.activeElement?.getAttribute('aria-controls') }), id);
    if (state.open || state.focus !== id) fail(`keyboard ${id}: Escape left it ${state.open ? 'open' : 'closed'}, focus on ${state.focus}`);
  }
  // plain top-level links
  for (const a of await p.$$eval('nav.mega-nav > a', (as) => as.map((a) => a.href))) {
    await p.goto(BASE + 'about', { waitUntil: 'networkidle' });
    await p.click(`nav.mega-nav > a[href="${new URL(a).pathname}"]`).catch(() => p.locator('nav.mega-nav > a').filter({ has: p.locator(`xpath=self::*[@href]`) }).first().click());
    await landed(p, path(a), 'top link ' + path(a));
  }
  console.log(`desktop menus: ${menus.length} dropdowns, ${followed} links followed by pointer, keyboard open/close on each`);
  await p.close();
}

// 3. panels fit a narrow desktop
{
  const p = await b.newPage({ viewport: { width: 1024, height: 800 } });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const ids = await p.$$eval('nav.mega-nav .mega-trigger', (xs) => xs.map((x) => x.getAttribute('aria-controls')));
  for (const id of ids) {
    if (!(await p.locator(`[aria-controls="${id}"]`).first().isVisible())) continue;
    await p.click(`[aria-controls="${id}"]`);
    const r = await p.locator('#' + id).boundingBox();
    if (!r || r.x < 0 || r.x + r.width > 1024 + 1) fail(`1024px: panel ${id} spans ${r && Math.round(r.x)}..${r && Math.round(r.x + r.width)}`);
    await p.keyboard.press('Escape');
  }
  await p.close();
}

// 4. phone sheet
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.click('[aria-label="Open navigation"]');
  const items = await p.$$eval('.mobile-sheet nav.mega-nav a', (as) => as.map((a) => a.href));
  const groups = await p.$$eval('.mobile-sheet .mega-trigger', (xs) => xs.map((x) => x.getAttribute('aria-controls')));
  let n = 0;
  for (const href of items) {
    if (new URL(href).origin !== new URL(BASE).origin) continue;
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.click('[aria-label="Open navigation"]');
    const sel = `.mobile-sheet a[href="${new URL(href).pathname}"]`; // same-site only
    const a = p.locator(sel).first();
    if (!(await a.isVisible())) {
      const panel = await a.evaluate((el) => el.closest('.mega-panel')?.id).catch(() => null);
      if (panel) await p.locator(`.mobile-sheet [aria-controls="${panel}"]`).tap();
    }
    if (!(await a.isVisible())) { fail(`phone: "${href}" not reachable in the sheet`); continue; }
    try { await a.tap({ timeout: 5000 }); }
    catch { fail(`phone: "${path(href)}" is in the sheet but cannot be scrolled to or tapped`); continue; }
    await landed(p, path(href), 'phone ' + path(href));
    n++;
  }
  console.log(`phone sheet: ${groups.length} groups, ${n}/${items.filter((h) => new URL(h).origin === new URL(BASE).origin).length} same-site links followed`);
  await p.close();
}

// 5. URLs as people type them
{
  const routes = ['products', 'technology', 'technology/safety', 'technology/control-loop', 'technology/die', 'technology/package',
    'applications', 'use-cases/motors', 'use-cases/defence', 'evidence', 'procurement', 'resources', 'resources/docs', 'resources/videos',
    'ask', 'about', 'about/team', 'about/recognition', 'company', 'contact'];
  const cap = (r) => r.split('/').map((s) => s[0].toUpperCase() + s.slice(1)).join('/');
  const variants = routes.flatMap((r) => [[cap(r), r], [r + '/', r], [r + '.html', r], [r.toUpperCase(), r]]);
  variants.push(['Resources/Videos', 'resources/videos'], ['use-cases', 'use-cases/motors'], ['Use-Cases/', 'use-cases/motors'], ['technology/', 'technology']);
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const base = path(BASE);
  for (const [typed, want] of variants) {
    await p.goto(BASE + typed, { waitUntil: 'networkidle' }).catch(() => {});
    await landed(p, base + '/' + want, `typed /${typed}`);
  }
  console.log(`typed URLs: ${variants.length} variants reach their page`);
  await p.close();
}

await b.close();
console.log(fails.length ? `\n${fails.length} navigation failure(s)` : '\nall navigation checks passed');
process.exit(fails.length ? 1 : 0);
