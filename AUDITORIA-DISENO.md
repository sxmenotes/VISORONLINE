# Revisión de diseño — web de servicios

## Cambios aplicados

- Colección: sustituida la grilla con filtros por un adelanto horizontal de los ocho estilos. Flechas, teclado y desplazamiento táctil; botón central al visor de invitaciones completas.
- Alineación: títulos introductorios, cabeceras de sección, presentación de planes y llamados a la acción centrados. Listas, preguntas y párrafos largos conservan alineación izquierda para lectura.
- Legibilidad: texto principal de 16 px; navegación y enlaces de 14 px; información auxiliar de 12–13 px. Los textos decorativos dentro de las muestras conservan tamaños menores, sin contener información necesaria para contratar.
- Móvil: muestra grande de un diseño y parte del siguiente, botones de 48 px, portada centrada y planes en una columna.
- Movimiento: GSAP y ScrollTrigger locales, entradas breves al desplazarse y transiciones de la tira. Sin reproducción automática para poder leer a cada ritmo. Al activar movimiento reducido, se eliminan las animaciones y el recorrido es inmediato.
- Accesibilidad: contenido visible inicialmente, enlaces al visor sin JavaScript, región desplazable con teclado y contador de diseño. El contenido sigue accesible si GSAP no carga.

## Alcance

Revisión de esta web promocional. No se modifican planes comerciales, datos reales ni diseños del editor. Las muestras son ilustrativas; el enlace externo conserva el destino configurado por el propietario.

## Verificación

- `npm test`: 19 pruebas aprobadas. `npm run build`: correcto.
- Comprobación adicional con DOM simulado: ocho diseños, recorrido hasta ambos extremos, flechas de teclado, menú y cierre con Escape; recursos locales presentes. Funcionamiento sin GSAP verificado en esta prueba.
- Revisión visual final en escritorio y móvil pendiente: la sesión de Safari cambió de pestaña durante la comprobación. Las pruebas de DOM no sustituyen la revisión del renderizado.

## Mejora móvil — octubre 2026

- Corregido el salto de línea que unía «primer» con «gran» en la portada.
- Corregida la cuadrícula heredada que estrechaba el párrafo introductorio de la colección.
- Cabecera principal persistente y menú desplegable superpuesto, con cierre al elegir enlace, tocar fuera o pulsar Escape.
- Botones y enlaces de navegación con áreas táctiles mayores; controles de cerrar, favoritos y siguiente/anterior ampliados.
- Formulario con campos de una columna, etiquetas más breves, controles amplios y CTA completo.
- Acceso al visor integrado en la misma pestaña; ajuste del iframe al cargar y al cambiar el viewport visual.
- Revisión real en Chromium a 320, 390 y 430 px: sin desbordamiento horizontal; menú, selección de plan y formulario comprobados sin enviar mensajes. Vista previa, cambio de diseño y enlace de consulta comprobados a 390 px.
- Inspección visual de portada, colección, formulario y vista previa. Esta revisión sustituye el pendiente visual anterior para esas vistas móviles; no representa una prueba en dispositivos físicos.
