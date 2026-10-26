import { cubicBezier } from 'animejs';

// Espejo en milisegundos de la tabla Motion de DESIGN.md, para las animaciones con Anime.js.
// Los mismos valores viven como variables CSS en styles/tokens.css.
export const MOVIMIENTO = {
  rapido: 120,
  base: 200,
  lento: 320,
  convergencia: 600,
  escalonadoHojas: 40,
} as const;

export const CURVA_ESTANDAR = cubicBezier(0.2, 0, 0, 1);

export const CONSULTA_MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)';
