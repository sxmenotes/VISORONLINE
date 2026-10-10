# Click! Acepto — Web de servicios

Página estática independiente. Abrir `index.html` para previsualizarla. HTML, CSS, JavaScript, fotografías y marca están dentro de esta carpeta; no requiere instalación para revisar el diseño. La entrega para Vercel se genera con `npm run build` (Node.js 24, sin dependencias externas).

Secciones: portada, adelanto dinámico de ocho diseños, beneficios, proceso, planes, preguntas frecuentes y contacto por WhatsApp. El menú móvil y los controles del adelanto se mejoran con JavaScript; los contenidos, preguntas y enlaces de navegación funcionan también sin él. El formulario de consulta requiere JavaScript para preparar el mensaje de WhatsApp.

Se conserva el WhatsApp existente. La colección se encuentra en `coleccion/index.html`, dentro de esta misma web. Antes de publicar, comprobar que ambos sean los destinos deseados. Los botones de contacto llevan primero al formulario: nombres y plan obligatorios, diseño y comentarios opcionales. Al continuar se abre WhatsApp con el mensaje preparado; no se envía automáticamente. El sitio no almacena los datos del formulario ni los envía a un servidor propio. No incorpora analíticas.

Planes: prestaciones de `atelier/sistema/planes.json`. Precios en pesos chilenos: Clásica $40.000 CLP, Platino $55.000 CLP y Gold $70.000 CLP, confirmados por el propietario.

Solo se incluyen recursos de demostración; no hay datos de clientes. Las tarjetas enlazan a la colección integrada, con filtros, favoritos y ocho demos. Ver `ATRIBUCIONES.md`.

Las fuentes del sistema usan Baskerville/Georgia y Futura/Arial como alternativas. El logotipo usa trazados y conserva su apariencia en cualquier dispositivo.

Esta reconstrucción no publica ni cambia el sitio remoto. Para desplegar, usar únicamente esta carpeta como sitio estático.

Movimiento con GSAP y ScrollTrigger locales en `assets/vendor/`, con sus avisos de licencia originales. Respeta movimiento reducido y mantiene contenido disponible sin JavaScript. Ver `AUDITORIA-DISENO.md` para las mejoras de lectura y composición.

## Publicar y aparecer en Google

Consultar [PUBLICAR-Y-SEO.md](PUBLICAR-Y-SEO.md). Incluye la configuración de GitHub/Vercel, la colección integrada y los pasos de Search Console. `npm run build` genera `dist/index.html`, `dist/robots.txt` y `dist/sitemap.xml` con las URLs definitivas. `npm test` comprueba los metadatos, previews y validaciones.

Para regenerar la colección desde el workspace completo: `npm run coleccion:web`. Publicar todo `web/` en un único repositorio/proyecto; no requiere `VISOR_URL`.
