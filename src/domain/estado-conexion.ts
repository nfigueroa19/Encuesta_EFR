// Resultado de comprobar, con la clave publicable, que la tabla `personal` rechaza lecturas (AN-04).
export type EstadoConexion =
  | { readonly tipo: 'verificando' }
  | { readonly tipo: 'protegida' }
  | { readonly tipo: 'expuesta' }
  | { readonly tipo: 'sin-conexion'; readonly detalle: string };
