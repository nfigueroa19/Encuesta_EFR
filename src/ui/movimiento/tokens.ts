// Espejo en milisegundos de la tabla Motion de DESIGN.md, para las animaciones con Motion.
// Los mismos valores viven como variables CSS en styles/tokens.css.
export const MOVIMIENTO = {
  rapido: 120,
  base: 200,
  lento: 320,
  convergencia: 600,
  escalonadoHojas: 40,
} as const;

// Motion trabaja en segundos.
export const segundos = (milisegundos: number) => milisegundos / 1000;

// ease-standard de DESIGN.md como curva Bézier para Motion.
export const CURVA_ESTANDAR = [0.2, 0, 0, 1] as const;

export const CONSULTA_MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)';
