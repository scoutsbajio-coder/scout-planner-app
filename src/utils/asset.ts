/** Ruta a un archivo de /public respetando la base de despliegue (p. ej. /scout-planner/). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
