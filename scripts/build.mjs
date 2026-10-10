import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export async function build({ env = process.env, out = join(root, 'dist') } = {}) {
  const config = JSON.parse(await readFile(join(root, 'site.config.json'), 'utf8'));
  const raw = env.SITE_URL || config.siteUrl || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  let url = '';
  if (raw) {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') throw new Error('SITE_URL debe ser una URL HTTPS sin ruta, credenciales, parámetros ni fragmento.');
    url = `${parsed.origin}/`;
  }
  if (env.VERCEL && !url) throw new Error('Falta SITE_URL o VERCEL_PROJECT_PRODUCTION_URL. Activa las variables de sistema de Vercel.');
  const indexable = Boolean(url) && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production');
  const title = 'Invitaciones digitales de boda | Click! Acepto by Kintu';
  const description = 'Invitaciones digitales de boda personalizadas. Exploren ocho diseños editoriales, elijan su plan y compartan su historia con Click! Acepto by Kintu.';
  let html = await readFile(join(root, 'index.html'), 'utf8');
  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '');
  const image = url ? `${url}social.png` : 'social.png';
  const metadata = [
    `<meta name="description" content="${description}">`,
    `<meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Click! Acepto">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${escape(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Click! Acepto — by Kintu. Invitaciones digitales de boda.">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${escape(image)}">`,
    `<meta name="twitter:image:alt" content="Click! Acepto — by Kintu">`
  ];
  if (url) {
    metadata.push(`<link rel="canonical" href="${escape(url)}">`, `<meta property="og:url" content="${escape(url)}">`);
    const graph = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', '@id': `${url}#organizacion`, name: 'Click! Acepto', alternateName: 'Click! Acepto by Kintu', url, logo: `${url}logo.svg` },
      { '@type': 'WebSite', '@id': `${url}#sitio`, name: 'Click! Acepto', alternateName: 'Click! Acepto by Kintu', url, inLanguage: 'es', publisher: { '@id': `${url}#organizacion` } },
      { '@type': 'WebPage', '@id': `${url}#pagina`, url, name: title, description, inLanguage: 'es', isPartOf: { '@id': `${url}#sitio` }, about: { '@id': `${url}#servicio` } },
      { '@type': 'Service', '@id': `${url}#servicio`, name: 'Diseño de invitaciones digitales de boda', serviceType: 'Invitaciones digitales personalizadas', provider: { '@id': `${url}#organizacion` }, url, description }
    ] };
    metadata.push(`<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`);
  }
  if (env.GOOGLE_SITE_VERIFICATION) metadata.push(`<meta name="google-site-verification" content="${escape(env.GOOGLE_SITE_VERIFICATION)}">`);
  html = html.replace('</head>', `${metadata.join('\n')}\n</head>`);
  await mkdir(out, { recursive: true });
  // Lista explícita: documentación, código de build y datos del editor no se publican.
  for (const file of ['style.css', 'script.js', 'contacto.js', 'favicon.ico', 'favicon.svg', 'logo.svg', 'logo-claro.svg', 'simbolo.svg', 'social.png', '404.html', 'ATRIBUCIONES.md', 'assets', 'coleccion']) await cp(join(root, file), join(out, file), { recursive: true });
  await writeFile(join(out, 'index.html'), html);
  let collection = await readFile(join(root, 'coleccion/index.html'), 'utf8');
  collection = collection.replace(/<meta\s+(?:name="(?:description|robots)"|property="og:[^"]+")[^>]*>/g, '');
  const collectionTitle = 'Colección de invitaciones de boda | Click! Acepto';
  const collectionDescription = 'Exploren ocho diseños de invitaciones digitales de boda. Comparen estilos, guarden favoritos y descubran las demos completas de Click! Acepto.';
  const collectionMeta = metadata.filter(tag => !tag.includes('application/ld+json')).map(tag => tag.replaceAll(title, collectionTitle).replaceAll(description, collectionDescription).replace(`href="${escape(url)}"`, `href="${escape(url)}coleccion/"`).replace(`property="og:url" content="${escape(url)}"`, `property="og:url" content="${escape(url)}coleccion/"`));
  collection = collection.replace(/<title>.*?<\/title>/s, `<title>${collectionTitle}</title>`).replace('</head>', collectionMeta.join('\n') + '</head>');
  await writeFile(join(out, 'coleccion/index.html'), collection);
  await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${indexable ? `\nSitemap: ${url}sitemap.xml\n` : ''}`);
  await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable ? `\n  <url><loc>${escape(url)}</loc></url>\n  <url><loc>${escape(url)}coleccion/</loc></url>\n` : ''}</urlset>\n`);
  return { url, indexable, out };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build();
  console.log(result.indexable ? `Web y SEO generados para ${result.url}` : 'Vista previa generada con noindex. Configura el dominio al publicar.');
}
