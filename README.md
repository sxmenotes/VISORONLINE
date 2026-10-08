# Click! Acepto · Selector de diseños

Sitio estático independiente con ocho demos de Clara y Mateo. Abre index.html para explorar el catálogo; también funciona servido por HTTP. No contiene clientes reales, contraseñas, servidor del editor ni base de datos.

## Publicarlo

1. Sube el contenido de esta carpeta a un repositorio propio en GitHub.
2. Impórtalo en Vercel con Framework Other, sin comando de build y directorio de salida punto (.). La configuración ya está en vercel.json.
3. Publica y revisa la URL final en móvil y PC. No requiere variables de entorno. Referencia: https://vercel.com/docs/project-configuration/vercel-json

El visor permite explorar, filtrar, guardar favoritos en el navegador y copiar la elección. No envía mensajes ni registra solicitudes. No solicita datos personales. Los favoritos solo se conservan en ese navegador si permite almacenamiento local. Las fuentes y enlaces de terceros necesitan Internet.

Las demos muestran las secciones de Gold como referencia visual; el diseño se elige independientemente del plan contratado. Los datos y las confirmaciones son ficticios.

Los ocho sitios están en disenos/<nombre>/. index.html incluye el sobre; vista.html entra directamente al contenido para el visor. Fotos, música y GSAP se incluyen localmente.

Regenerar desde el workspace: npm run visor. Fuente de diseños: atelier/coleccion/. Fuente del visor: atelier/sistema/visor/. No editar esta salida a mano.

Consulta ATRIBUCIONES.md para las fotografías y recursos originales.
