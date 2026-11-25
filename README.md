# Scout Planner

Aplicación web instalable (PWA) para organizar actividades scout, campamentos y el seguimiento del adelanto de Tropa. La información se almacena localmente en IndexedDB.

## Requisitos
- Node.js 20 o posterior recomendado
- npm

## Desarrollo
```bash
npm install
npm run dev
```

## Verificación y producción
```bash
npm run build
npm run preview
```

Publica el contenido de `dist/` en un hosting HTTPS. Si se publica bajo una ruta distinta de `/` (por ejemplo GitHub Pages), compila con `npm run build -- --base=/nombre-del-repo/`; el manifest y el service worker se generan solos con esa ruta. En GitHub Pages el flujo también copia `index.html` como `404.html` para que recargar una sección (p. ej. `/campamentos`) no dé error.

## Instalación móvil
- **Android:** abre la URL HTTPS en Chrome y selecciona *Instalar aplicación* o *Agregar a pantalla principal*.
- **iPhone/iPad:** abre la URL HTTPS en Safari, toca *Compartir* y selecciona *Agregar a pantalla de inicio*.

La primera visita necesita Internet para descargar la aplicación. Al terminar, aparece el aviso «Lista para usarse sin conexión»: el service worker (generado con `vite-plugin-pwa`/Workbox) precachea todo el build —HTML, JS, CSS, iconos e insignias—, y los datos se guardan localmente en IndexedDB.

**Instalación y actualizaciones:** en Ajustes hay una sección «Instalar en este dispositivo» (botón en Android/escritorio, instrucciones en iPhone). Cuando se publica una versión nueva, la app muestra «Hay una versión nueva» y la aplica solo cuando el usuario toca *Actualizar*, para no perder lo que esté capturando. Para cambiar iconos, nombre o accesos directos edita la sección `manifest` de `vite.config.ts` (ya no existe `public/manifest.webmanifest` ni `public/service-worker.js`). No hay sincronización entre dispositivos, ni respaldo remoto automático. Para transferir información entre dispositivos utiliza el respaldo JSON.

## Datos y migraciones
La base de datos `scout-planner-db` mantiene los almacenes originales (`events`, `tasks`, `notes`, `templates`) y crea `scouts`, `evaluations` y `camps` mediante actualización de versión de IndexedDB. La actualización no borra las colecciones existentes. Exporta respaldos desde Configuración antes de actualizar una instalación con datos importantes.

Los respaldos JSON incluyen eventos, tareas, bitácora, plantillas, muchachos, evaluaciones e información de campamentos. Los respaldos antiguos que no incluyan las colecciones nuevas no las reemplazan al importarse.

## Protección de datos y respaldos
- **Almacenamiento persistente:** la primera vez que se guarda información la app le pide al navegador que no borre sus datos por falta de espacio (`navigator.storage.persist()`). En Ajustes → *Protección de datos* se ve el estado y se puede volver a solicitar. Chrome/Android suele concederlo en silencio, sobre todo con la app instalada; Firefox muestra un permiso.
- **Recordatorio de respaldo:** si hay cambios sin respaldar y han pasado 7 días desde el último respaldo (o desde que se empezó a usar la app), aparece un aviso con «Respaldar ahora» y «Mañana». Si no hay cambios nuevos, no avisa. En iPhone/iPad el respaldo se entrega con la hoja de compartir (Archivos, iCloud, Drive, WhatsApp); en los demás dispositivos se descarga el `.json`.
- Las fechas de último respaldo y de último cambio se guardan en `localStorage` del mismo navegador.

## Contenido de adelanto
Los retos de tercera, segunda y primera clase se transcribieron de los PDF suministrados (una página por clase). Las imágenes de insignias se recortaron de las páginas originales y se guardan en `public/insignias/`. Se mantienen expresiones y posibles erratas del original. En particular, el reto 15 de Segunda Clase termina en «heridas,» en el documento proporcionado; no se completó con información externa.

Cada reto se evalúa con una sola casilla: completado o no. Al marcarlo se registra la fecha y quién evalúa (el nombre se recuerda entre sesiones); la nota es opcional. Los retos que en versiones anteriores estaban «En proceso» aparecen sin marcar y conservan su nota.

El avance porcentual es informativo y no equivale a una aprobación. Los requisitos administrativos y la validación de la Corte de Honor requieren confirmación manual de los responsables.

## Privacidad y alcance
Los registros se guardan en el navegador/dispositivo que utiliza la aplicación. Borrar los datos del navegador puede eliminarlos; exporta respaldos con regularidad. No hay cuentas, roles, cifrado de datos locales ni sincronización multiusuario en esta versión.
