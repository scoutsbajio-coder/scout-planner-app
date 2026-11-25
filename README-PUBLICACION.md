# Publicar Scout Planner en GitHub Pages (Android)

1. En GitHub crea un repositorio nuevo llamado `scout-planner`.
2. Descomprime este proyecto y sube el **contenido** de la carpeta `scout-planner` a la raíz del repositorio (incluida la carpeta oculta `.github`).
3. En GitHub abre **Settings → Pages** y en **Build and deployment** selecciona **GitHub Actions**.
4. Abre la pestaña **Actions**. El flujo `Deploy Scout Planner to GitHub Pages` compilará y publicará el sitio al subir a la rama `main`.
5. Cuando el flujo termine en verde, GitHub mostrará la URL publicada, normalmente `https://TU-USUARIO.github.io/scout-planner/`.
6. En Android abre esa URL con Chrome. Usa el menú ⋮ → **Instalar aplicación** o **Agregar a pantalla principal**.

La compilación en GitHub Actions se ejecuta en Linux e instala dependencias con `npm ci`; esto evita el problema de dependencia nativa de Rollup del entorno de desarrollo actual.

## Desarrollo local

```bash
npm ci
npm run dev
npm run build
```

## Importante

- No subas `node_modules` ni `dist`; GitHub Actions los genera.
- El flujo de Actions copia `index.html` como `404.html`; no lo borres, permite recargar secciones como `/campamentos`.
- Cada vez que publiques una versión nueva, quien tenga la app instalada verá el aviso «Hay una versión nueva» y podrá actualizar.
- Publica únicamente en HTTPS para habilitar instalación PWA y Service Worker.
- Los datos guardados en IndexedDB pertenecen al navegador/dispositivo. Exporta respaldos JSON antes de borrar datos del navegador o cambiar de dispositivo.
- La compilación remota debe finalizar correctamente en **Actions** antes de considerar publicada la aplicación.
