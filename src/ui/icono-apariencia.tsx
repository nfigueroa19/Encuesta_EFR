import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { CURVA_ESTANDAR, MOVIMIENTO, segundos } from './movimiento/tokens';

interface PropsIconoApariencia {
  readonly abierto: boolean;
}

// Círculo con una mitad llena (símbolo habitual de contraste); gira media vuelta al abrir el panel.
export function IconoApariencia({ abierto }: PropsIconoApariencia) {
  const reducido = useReducedMotion() === true;
  return (
    <LazyMotion features={domAnimation}>
      <m.svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="size-6"
        animate={{ rotate: abierto ? 180 : 0 }}
        transition={{ duration: reducido ? 0 : segundos(MOVIMIENTO.lento), ease: CURVA_ESTANDAR }}
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={1.75} />
        <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
      </m.svg>
    </LazyMotion>
  );
}
