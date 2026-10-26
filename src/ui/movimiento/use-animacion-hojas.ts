import { animate, createScope, stagger, type AnimationParams } from 'animejs';
import { useEffect, useRef } from 'react';
import { CONSULTA_MOVIMIENTO_REDUCIDO, CURVA_ESTANDAR, MOVIMIENTO } from './tokens';

// DESIGN.md Motion 3 (despliegue en la introducción) y Motion 5 (convergencia en la confirmación final).
// Una sola vez al montar; revert() restaura los estilos al desmontar; con movimiento reducido no se anima.
const PARAMETROS = {
  despliegue: {
    opacity: [0, 1],
    scale: [0.6, 1],
    translateY: [12, 0],
    duration: MOVIMIENTO.lento,
    delay: stagger(MOVIMIENTO.escalonadoHojas),
  },
  convergencia: {
    opacity: [0, 1],
    translateY: [-48, 0],
    scale: [1.4, 1],
    duration: MOVIMIENTO.convergencia,
    delay: stagger(MOVIMIENTO.escalonadoHojas, { from: 'center' }),
  },
} satisfies Record<string, AnimationParams>;

export type AnimacionHojas = keyof typeof PARAMETROS;

export function useAnimacionHojas<T extends HTMLElement>(animacion: AnimacionHojas) {
  const raiz = useRef<T>(null);

  useEffect(() => {
    const ambito = createScope({
      root: raiz,
      mediaQueries: { reducido: CONSULTA_MOVIMIENTO_REDUCIDO },
    }).add((self) => {
      if (self?.matches.reducido) return;
      animate('.hoja-abanico', { ...PARAMETROS[animacion], ease: CURVA_ESTANDAR });
    });
    return () => { ambito.revert(); };
  }, [animacion]);

  return raiz;
}
