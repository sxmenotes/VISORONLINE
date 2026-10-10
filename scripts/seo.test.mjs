import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from './build.mjs';
const directory = () => mkdtemp(join(tmpdir(), 'click-seo-'));
const env = { VERCEL: '1', VERCEL_ENV: 'production', SITE_URL: 'https://example.com' };
test('producción: URLs coherentes, datos estructurados y salida pública aislada', async () => {
 const out = await directory(); await build({ env, out });
 const html = await readFile(join(out,'index.html'),'utf8');
 assert.match(html, /rel="canonical" href="https:\/\/example.com\/"/);
 assert.match(html, /index, follow, max-image-preview:large/);
 assert.match(html, /https:\/\/example.com\/social.png/);
 assert.match(html, /coleccion\/index.html#diseno-editorial/);
 assert.doesNotMatch(html, /https:\/\/clickacepto.vercel.app/);
 const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(data['@graph'][1].url, 'https://example.com/');
 assert.match(await readFile(join(out,'robots.txt'),'utf8'), /Sitemap: https:\/\/example.com\/sitemap.xml/);
 const sitemap = await readFile(join(out,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,2);
 assert.ok(!(await readdir(out)).includes('site.config.json'));
});
test('preview: noindex y sin URLs en el sitemap', async () => {
 const out = await directory();await build({env:{...env,VERCEL_ENV:'preview'},out});
 assert.match(await readFile(join(out,'index.html'),'utf8'), /noindex, follow/);
 assert.doesNotMatch(await readFile(join(out,'sitemap.xml'),'utf8'), /<loc>/);
});
test('bloquea dominio inválido', async () => {
 await assert.rejects(build({env:{...env,SITE_URL:'https://example.com/path'},out:await directory()}));
});
test('colección integrada: canonical, ocho demos locales y muestras noindex', async () => {
 const out=await directory();await build({env,out});
 const html=await readFile(join(out,'coleccion/index.html'),'utf8');
 assert.match(html,/rel="canonical" href="https:\/\/example.com\/coleccion\/"/);
 const catalog=[...html.matchAll(/class="design-card" id="diseno-([^"]+)"/g)].map(match=>({id:match[1]}));
 assert.equal(catalog.length,8);
 for(const design of catalog) for(const page of ['index.html','vista.html']) {
  const demo=await readFile(join(out,'coleccion/disenos',design.id,page),'utf8');
  assert.match(demo,/name="robots" content="noindex, follow"/);
 }
 assert.match(html,/href="..\/index.html"/);
});
test('verificación de Search Console escapada como atributo', async () => {
 const out=await directory();await build({env:{...env,GOOGLE_SITE_VERIFICATION:'code"<test>'},out});
 assert.match(await readFile(join(out,'index.html'),'utf8'), /code&quot;&lt;test&gt;/);
});

test('recursos de colección y demos resuelven igual con rutas limpias o HTML', async () => {
 const {runInNewContext}=await import('node:vm');
 for(const [page,paths,expected] of [
  ['coleccion/index.html',['/coleccion','/coleccion/','/coleccion/index.html'],'/coleccion/'],
  ['coleccion/disenos/editorial/vista.html',['/coleccion/disenos/editorial/vista','/coleccion/disenos/editorial/vista/','/coleccion/disenos/editorial/vista.html'],'/coleccion/disenos/editorial/']
 ]) {
  const html=await readFile(new URL('../'+page,import.meta.url),'utf8');
  const script=html.match(/<head><script>(.*?)<\/script>/s)[1];
  for(const pathname of paths){
   let base;const document={createElement:()=>({}),head:{appendChild(el){base=el.href;}}};
   runInNewContext(script,{location:{protocol:'http:',pathname},document});
   assert.equal(base,expected);
   for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(/^(https?:|data:)/.test(match[1]))continue;
    const resolved=new URL(match[1],new URL(base,'http://localhost'));
    if(resolved.hash)continue;
    await readFile(new URL('..'+resolved.pathname,import.meta.url));
   }
  }
  let appended=false;runInNewContext(script,{location:{protocol:'file:'},document:{head:{appendChild(){appended=true;}}}});assert.equal(appended,false);
 }
});
