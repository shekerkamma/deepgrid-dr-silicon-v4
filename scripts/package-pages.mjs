import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source=path.join(root,'dist/client'), output=path.join(root,'dist/pages');
// PAGES_BASE is the URL path the site is served under; PAGES_DOMAIN writes a CNAME when set.
// github.io project site: PAGES_BASE=/deepgrid-dr-silicon-v3/ PAGES_DOMAIN=
// CI sets PAGES_BASE from the repo name, so all three Pages sites build from this one source.
// The default below is only for local runs; it must name the canonical repo, because a default
// naming a mirror silently packages the site for a base it is not served under.
// custom domain:          PAGES_BASE=/                     PAGES_DOMAIN=dr.deepgridsemi.com
// Content assets are authored root-absolute ("/media/x.jpg") so they resolve from any route depth;
// a relative "./media/x.jpg" breaks the moment a page lives at /technology/safety. The export leaves
// them at the site root, so they need the same base prefix /_next/ gets.
const CONTENT_ROOTS=['images','decks','media','downloads','diagrams'];
const base=(process.env.PAGES_BASE||'/deepgrid-dr-silicon-v3/').replace(/\/?$/,'/').replace(/^\/?/,'/');
const domain=(process.env.PAGES_DOMAIN||'').trim();
fs.rmSync(output,{recursive:true,force:true});
fs.cpSync(source,output,{recursive:true});
if(base!=='/'){
 // The export emits scripts and styles under an absolute /_next/ prefix, which a project site cannot serve.
 // Vite's preload map lists deps as "_next/static/..." and its URL builder prepends "/", so those
 // need the base without its leading slash or every preload 404s beside the working import.
 const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.(html|js|rsc|json|css)$/.test(file)){let text=fs.readFileSync(file,'utf8').replaceAll('/_next/',base+'_next/');if(file.endsWith('.js'))text=text.replaceAll('"_next/static/','"'+base.slice(1)+'_next/static/');for(const dir of CONTENT_ROOTS)for(const q of ['"',"'",'`'])text=text.replaceAll(q+'/'+dir+'/',q+base+dir+'/');if(file.endsWith('.html'))text=text.replace(/(<meta name="site-base" content=")[^"]*(")/,'$1'+base+'$2');fs.writeFileSync(file,text);}}};
 walk(output);
 // The rewrite is a string substitution, so it only sees a reference that is quoted the way it
 // expects. It first matched only a double quote; the bundler emits template literals, so 43
 // references kept a bare root and every one of them 404'd -- but ONLY after a client render,
 // because the server-rendered HTML for the same page was rewritten correctly. A fresh load of
 // every route therefore passed while /ask's graph link was dead. Scan the whole package instead
 // of trusting the substitution, and fail the build rather than shipping it.
 const ROOT_REF=new RegExp('[\'"`]/(?:'+CONTENT_ROOTS.join('|')+')/','g');
 const stale=[];
 (function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);
  if(e.isDirectory())scan(f);
  else if(/\.(html|js|rsc|json|css)$/.test(f)){const t=fs.readFileSync(f,'utf8');
   for(const m of t.matchAll(ROOT_REF))stale.push(path.relative(output,f)+': '+t.slice(m.index,m.index+52).split('\n')[0]);}}})(output);
 if(stale.length)throw Error('Unprefixed asset reference survived packaging ('+stale.length+'):\n  '+stale.slice(0,12).join('\n  '));
 const chunks=path.join(output,'_next/static/chunks');
 for(const f of fs.readdirSync(chunks).filter(f=>f.endsWith('.js')))if(fs.readFileSync(path.join(chunks,f),'utf8').includes('"_next/static/'))throw Error('Unprefixed preload dependency in '+f);
}
// A page that lost its base meta would render every nav link pointing at the domain root,
// which looks like a working build and 404s on click. Check each page, not just index.html.
const pages=[];(function scanHtml(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory()){if(e.name!=='_next'&&e.name!=='downloads')scanHtml(f);}else if(e.name.endsWith('.html'))pages.push(f);}})(output);
for(const f of pages){const t=fs.readFileSync(f,'utf8');if(!t.includes('<meta name="site-base" content="'+base+'"'))throw Error('Missing or wrong site-base meta in '+path.relative(output,f));}
// Every route declared in app/routes.ts must have exported a page. vinext reports an
// unprerendered route as "skipped" and still exits 0, so a build can go green having
// silently dropped pages — which it did, losing /applications and /evidence.
const routeSrc=fs.readFileSync(path.join(root,'app/routes.ts'),'utf8');
const declared=[...routeSrc.matchAll(/href:\s*'([^']+)'/g)].map(m=>m[1]);
if(declared.length<8)throw Error(`Only ${declared.length} routes parsed from app/routes.ts; the route table looks wrong`);
const missing=declared.filter(r=>{const f=r==='/'?'index.html':r.replace(/^\//,'')+'.html';return !fs.existsSync(path.join(output,f));});
if(missing.length)throw Error(`Declared routes missing from the export: ${missing.join(', ')}`);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
if(domain)fs.writeFileSync(path.join(output,'CNAME'),domain+'\n');
fs.writeFileSync(path.join(output,'build-info.json'),JSON.stringify({commit:process.env.GITHUB_SHA||'local',base,domain:domain||null,builtAt:new Date().toISOString()}));
const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
let checked=0;
for(const [,ref] of html.matchAll(/(?:src|href)="([^"?#]+)"/g)){
 if(/^(https?:|data:|mailto:|#)/.test(ref))continue;
 // Navigation hrefs (/products, /technology/safety) are routes, not files. They still have to
 // carry the base — a bare "/products" points at the domain root and 404s on a project site —
 // but they are checked against the route map, not the filesystem.
 const isAsset=/\.[a-z0-9]{2,5}$/i.test(ref);
 if(ref.startsWith('/')&&!ref.startsWith(base))throw Error((isAsset?'Unprefixed asset: ':'Unprefixed link: ')+ref);
 if(!isAsset)continue;
 const relative=ref.startsWith(base)?ref.slice(base.length):ref.replace(/^\.\//,'');
 if(!fs.existsSync(path.join(output,relative)))throw Error('Missing asset: '+ref);
 checked++;
}
const appFiles=[];(function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())scan(f);else if(/\.(tsx?|css)$/.test(e.name))appFiles.push(f);}})(path.join(root,'app'));
const appSource=appFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
// Every literal ./images|decks|media|downloads|diagrams path in the app must exist in the artifact,
// plus one slide image per film segment, since slide paths are built at runtime.
const images=[...new Set([...appSource.matchAll(/["'`]\/((?:images|decks|media|downloads|diagrams)\/[\w./-]+\.(?:webp|png|svg|jpg|mp4|vtt|pptx|drawio|md|pdf))/g)].map(m=>m[1]))];
for(const rel of images)if(!fs.existsSync(path.join(output,rel)))throw Error('Missing asset: '+rel);
for(const film of fs.readdirSync(path.join(root,'app/data')).filter(f=>f.endsWith('-film.json'))){
 const dir=film.replace(/-film\.json$/,'');
 const data=JSON.parse(fs.readFileSync(path.join(root,'app/data',film),'utf8'));
 for(const seg of data.segments){const f=path.join(output,'decks',dir,`slide-${String(seg.slide).padStart(2,'0')}.webp`);if(!fs.existsSync(f))throw Error('Missing slide image: '+f);}
}
// library-data.ts builds each package's deck, film, captions and poster paths from a slug, so the
// literal scan above cannot see them; check every media('<slug>') package explicitly.
const pkgSource=fs.readFileSync(path.join(root,'app/library-data.ts'),'utf8');
const slugs=[...pkgSource.matchAll(/media\('([\w-]+)'\)/g)].map(m=>m[1]);
if(slugs.length<5)throw Error(`Expected at least 5 packages in library-data.ts, found ${slugs.length}`);
for(const slug of slugs)for(const rel of [`downloads/${slug}.pptx`,`media/${slug}.mp4`,`media/${slug}.vtt`,`media/${slug}-poster.jpg`]){
 if(!fs.existsSync(path.join(output,rel)))throw Error('Missing package file: '+rel);
 images.push(rel);
}
if(checked<3)throw Error(`Only ${checked} entry references found; the export looks empty`);
console.log(`Pages package ready at base ${base}${domain?' for '+domain:''}: ${checked} entry references and ${images.length} asset paths verified across ${slugs.length} packages.`);
