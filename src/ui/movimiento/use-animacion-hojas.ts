import { animate, stagger } from 'motion';
import { useEffect, useRef } from 'react';
import { CONSULTA_MOVIMIENTO_REDUCIDO, CURVA_ESTANDAR, MOVIMIENTO, segundos } from './tokens';

// DESIGN.md Motion 5: en la confirmación final las seis hojas convergen una sola vez.
// cancel() al desmontar; con movimiento reducido no se anima.
export function useConvergenciaHojas<T extends HTMLElement>() {
  const raiz = useRef<T>(null);

  useEffect(() => {
    if (raiz.current === null || window.matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches) return undefined;
    const control = animate(
      raiz.current.querySelectorAll('.hoja-abanico'),
      { opacity: [0, 1], y: [-48, 0], scale: [1.4, 1] },
      {
        duration: segundos(MOVIMIENTO.convergencia),
        delay: stagger(segundos(MOVIMIENTO.escalonadoHojas), { from: 'center' }),
        ease: CURVA_ESTANDAR,
      },
    );
    return () => { control.cancel(); };
  }, []);

  return raiz;
}
