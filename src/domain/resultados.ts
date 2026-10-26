// Respuestas de las funciones RPC efr_verificar_cedula y efr_enviar_encuesta, ya traducidas.
export type ResultadoAcceso =
  | { readonly tipo: 'habilitado' }
  | { readonly tipo: 'no-habilitado' }
  | { readonly tipo: 'ya-respondio' }
  | { readonly tipo: 'error'; readonly detalle: string };

export type ErrorAcceso = 'cedula-invalida' | 'no-habilitado' | 'conexion';

export type ResultadoEnvio =
  | { readonly tipo: 'registrado' }
  | { readonly tipo: 'no-habilitado' }
  | { readonly tipo: 'ya-respondio' }
  | { readonly tipo: 'error'; readonly detalle: string };
