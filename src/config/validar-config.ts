export interface ConfigPublica {
  url: string;
  clave: string;
}

// Corre en vite.config.ts antes de cada build: sin variables, con una clave sb_secret_ o con un
// destino sin HTTPS el despliegue se detiene. Los mensajes nunca incluyen el valor recibido.
export function validarConfigPublica(url: string | undefined, clave: string | undefined): ConfigPublica {
  if (url === undefined || clave === undefined) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el entorno del build.');
  }
  if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
    throw new Error('VITE_SUPABASE_URL debe ser una URL https.');
  }
  if (!clave.startsWith('sb_publishable_')) {
    throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY debe ser una clave sb_publishable_.');
  }
  return { url, clave };
}
