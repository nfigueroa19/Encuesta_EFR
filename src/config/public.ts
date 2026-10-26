// Valores públicos por diseño: la protección de los datos depende de RLS y de los permisos
// en Supabase, no de ocultar estas cadenas (decision-gestion-secretos-sin-env).
// En Render llegan como variables del build y vite.config.ts las valida; el respaldo solo
// sirve a `vite` en desarrollo y pruebas, porque el build se detiene si faltan.
const RESPALDO_DESARROLLO = {
  url: 'https://fbujqbeylertkpcbcygd.supabase.co',
  clave: 'sb_publishable_EZOJhu1dl_ps6hPZts4v5w_0j3H9lMB',
} as const;

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? RESPALDO_DESARROLLO.url;
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? RESPALDO_DESARROLLO.clave;
