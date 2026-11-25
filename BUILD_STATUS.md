# Estado de entrega y verificaciones

Fecha: 25 de noviembre de 2026

## Entrega 2: protección de datos y evaluación simplificada
- **Evaluación con casilla:** cada reto se marca como completado o no (ya no hay lista Pendiente / En proceso / Completado). Al marcarlo se guarda fecha y evaluador; la nota es opcional y ya no crea registros vacíos ni cambia la fecha de un reto completado. Los datos antiguos «En proceso» se leen sin problema (aparecen sin marcar).
- Tarjetas de resumen: «Retos completados» y «Retos por completar» (antes contaba registros «Pendiente», que no reflejaba lo que falta).
- Corregido: al cambiar de muchacho, las notas de los retos podían quedarse con el texto del anterior.
- El nombre del evaluador se recuerda entre sesiones.
- **Almacenamiento persistente** (`navigator.storage.persist()`) solicitado al guardar datos por primera vez, con estado y botón en Ajustes.
- **Recordatorio de respaldo** (7 días, solo si hay cambios nuevos; «Mañana» lo pospone) y fecha de último respaldo en Ajustes. En iPhone el respaldo se comparte con la hoja de compartir.
- Se agregó `.gitignore` y se eliminó `Dashboard.tsx.tmp`.

### Verificaciones de esta entrega
- `npm ci` + `npm run build -- --base=/scout-planner/`: correcto (precaché de 24 entradas, ≈412 KiB).
- 18 pruebas automáticas (jsdom + IndexedDB simulado) pasaron: reglas del recordatorio, solicitud única de persistencia, marcar/desmarcar retos y avance, notas sin registros vacíos, datos antiguos «En proceso», notas por muchacho, aviso de respaldo (aparece, se pospone, desaparece al respaldar). Las pruebas no se incluyen en el ZIP.
- Pendiente en dispositivo real: la concesión de persistencia depende del navegador; la hoja de compartir en iPhone; el aspecto del aviso en pantallas pequeñas.

---
## Entrega 1: PWA y rutas

## Cambios de esta entrega
- **Rutas con base de despliegue:** el logo y las insignias usan `import.meta.env.BASE_URL` (antes eran rutas absolutas que fallaban en `/scout-planner/`).
- **404.html:** el flujo de GitHub Actions copia `index.html` a `404.html` para que recargar una sección no dé error.
- **Exportación CSV corregida:** el separador de líneas (`\r\n`) y el BOM (`\uFEFF`) se escribían como texto literal.
- **Service worker con precaché completo (`vite-plugin-pwa` + Workbox):** incluye JS y CSS con hash, iconos e insignias; navegación sin conexión a cualquier sección.
- **Manifest generado por el plugin:** iconos `any` y `maskable` separados (se agregaron `icon-maskable-192/512.png` y `apple-touch-icon.png`), `id`, categorías y accesos directos.
- **Aviso de actualización** («Hay una versión nueva» → Actualizar / Más tarde) y aviso «Lista para usarse sin conexión».
- **Botón/guía de instalación** en Ajustes (Android y escritorio con botón; iPhone con instrucciones).
- Se eliminan las cachés manuales antiguas (`scout-planner-*`) al abrir la app.

## Verificaciones ejecutadas
- `tsc -b`: correcto.
- `npm run build -- --base=/scout-planner/`: correcto; precaché de 24 entradas (≈403 KiB) con JS, CSS, HTML, iconos e insignias.
- Servido `dist` bajo `/scout-planner/`: todos los archivos del precaché responden 200; el bundle ya no contiene rutas absolutas `/insignias` ni `/icons`.

## Pendiente de probar en dispositivo real (no se pudo en este entorno)
- Instalación en Android (Chrome) y en iPhone (Safari).
- Modo avión: abrir la app instalada y navegar entre secciones.
- Flujo de actualización: publicar una versión nueva y confirmar que aparece el aviso (las instalaciones previas recibirán el nuevo service worker con el mismo nombre de archivo).
- Recarga de una sección en GitHub Pages (`/scout-planner/campamentos`).

## Siguientes pasos sugeridos
Almacenamiento persistente (`navigator.storage.persist()`) y recordatorio de respaldo; reportes PDF; vinculación de participantes con el padrón; limpieza de `Dashboard.tsx.tmp` y `.gitignore`.
