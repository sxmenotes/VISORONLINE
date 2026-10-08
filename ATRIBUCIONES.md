# Atribuciones de las demos

## Fotografía

Soulseeker – Creative Photography / Unsplash.
https://unsplash.com/photos/wedding-archway-with-white-flowers-aRQrz0fclB8
Licencia: https://unsplash.com/license

## Ampliación del prototipo

Tres lugares ficticios (civil 11:00, iglesia 17:00, recepción 18:30), galería ampliable, música instrumental original sintetizada localmente en assets/nuestro-si.wav con reproducción voluntaria y botón de silencio, reproductor Spotify bajo demanda y tarjetas de regalos. No se aceptan pagos; banco, alias y CBU son ficticios. El enlace Spotify es una playlist pública de Topsify Spain y puede reemplazarse en index.html y app.js.

Fotos de galería bajo Unsplash License:
- Céline Druguet: https://unsplash.com/photos/Rnton6rhDe4
- Jan Jirásek: https://unsplash.com/photos/q5YnuVLa5gk
- Marius Muresan: https://unsplash.com/photos/VaeVQXvunDw

## Animaciones GSAP

GSAP 3.14.2 y ScrollTrigger se sirven desde `disenos/<diseño>/assets/vendor` (avisos de licencia incluidos en los archivos). `animations.js` controla las entradas al desplazar la página mediante matchMedia; `welcome.js` controla la secuencia de apertura del sobre. Se respeta `prefers-reduced-motion`, incluidos cambios durante la apertura. Sin las librerías se conserva la animación CSS; sin JavaScript se muestra directamente la invitación.

Documentación: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ y https://gsap.com/docs/v3/Plugins/ScrollTrigger/
