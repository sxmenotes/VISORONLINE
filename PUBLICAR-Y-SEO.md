# Publicación y SEO — Click! Acepto

## Dominio y colección

La web y su colección se publican juntas en **https://clickacepto.vercel.app**. La página adicional está en `/coleccion/`, con sus dieciséis demos y recursos locales. No requiere `VISOR_URL` ni otro proyecto de Vercel.

Para revisar sin servidor, abrir `coleccion/index.html`. Para regenerar las demos desde el workspace completo: `npm run coleccion:web`. Las fuentes están en `atelier/sistema/visor/` y `atelier/coleccion/`; no editar a mano la salida `web/coleccion`. El repositorio público solo necesita `web`: no depende del editor durante el deploy.

## GitHub y Vercel

1. Crear un repositorio para **el contenido de `web/` únicamente**, incluidos los archivos ocultos `.gitignore` y `.env.example`. No subir la carpeta principal del editor, clientes ni archivo histórico. `dist/` se genera y no necesita estar en GitHub.
2. Importar ese repositorio en Vercel. Si el contenido de `web` está en la raíz del repo, usar Root Directory `.`. Framework Preset: **Other**. `vercel.json` define el build `npm run build` y la salida `dist`.
3. Mantener el dominio `clickacepto.vercel.app` en este proyecto. Si se crea un proyecto nuevo, transferir el dominio al realizar el reemplazo.
4. Desplegar en producción. Esta tarea solo prepara archivos: no crea repositorios ni modifica proyectos o dominios de Vercel.
5. Verificar en la URL final: portada y navegación; botón de diseños; `/robots.txt`; `/sitemap.xml`; `/social.png`; una ruta inexistente (debe devolver HTTP 404, no una portada con HTTP 200).

No se requieren paquetes externos. Para generar la entrega local: desde `web/`, ejecutar `npm run build`. La carpeta `dist/` contiene el sitio publicable. El archivo fuente `index.html` continúa abriéndose directamente para revisar diseño; el SEO completo se genera en `dist/index.html`.

## Variables opcionales

- `SITE_URL`: sustituye el dominio de `site.config.json`. Usar HTTPS sin rutas ni parámetros. Si tampoco hay dominio en el archivo, se usa `VERCEL_PROJECT_PRODUCTION_URL`. Al cambiar de dominio, volver a desplegar y configurar la redirección del dominio anterior desde Vercel.
- `GOOGLE_SITE_VERIFICATION`: código real de verificación de Search Console. El build lo incorpora en una etiqueta meta; no se incluye un código ficticio.
- `.env.example` es una referencia: el script no carga archivos `.env`. En Vercel, usar Settings → Environment Variables.

## Incluido

- Título y descripción orientados a invitaciones digitales de boda.
- URL canónica, Open Graph y Twitter Card, con imagen absoluta de 1200 × 630 px.
- JSON-LD de Organization, WebSite, WebPage y Service, sin reseñas, direcciones ni precios inventados.
- Sitemap XML con la portada y la colección: las secciones con `#` no son páginas independientes. Las demos ficticias quedan fuera del sitemap y llevan `noindex`; no se añaden fechas de modificación ficticias.
- `robots.txt` con referencia al sitemap en producción.
- Previews de Vercel con `noindex` y sitemap vacío; se permite el rastreo para que los buscadores puedan leer `noindex`.
- Página 404, rutas de archivos HTML preservadas y salida que incluye solo archivos públicos autorizados. Las atribuciones de recursos se conservan.

## Google Search Console después de publicar

1. Añadir la propiedad de prefijo URL `https://clickacepto.vercel.app/`. Verificar con la etiqueta HTML: copiar únicamente el valor `content` a `GOOGLE_SITE_VERIFICATION` y volver a desplegar. Con un dominio propio también se puede usar verificación DNS.
2. Enviar `sitemap.xml` desde la sección Sitemaps.
3. Usar Inspección de URLs para comprobar la portada y solicitar indexación.
4. Revisar indexación, consultas e impresiones en Search Console. Comprobar también PageSpeed Insights en móvil y validar el marcado con Schema Markup Validator; no todos los tipos de Schema generan resultados enriquecidos en Google.

Estos archivos facilitan el rastreo y la comprensión de la página; no garantizan indexación ni posiciones. La relevancia del contenido, el rendimiento y las menciones reales de la marca también requieren seguimiento. No se añaden keywords ocultas ni promesas de aparecer primero.

## Referencias oficiales

- [Configuración de Vercel](https://vercel.com/docs/project-configuration/vercel-json)
- [Variables de sistema de Vercel](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Crear y enviar un sitemap a Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Nombre del sitio en Google](https://developers.google.com/search/docs/appearance/site-names)
