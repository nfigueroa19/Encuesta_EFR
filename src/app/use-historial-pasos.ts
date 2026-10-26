import { useEffect } from 'react';
import { clavePaso, pasoDesdeClave, type Paso } from '../domain/flujo';

const CLAVE_HISTORIAL = 'efrPaso';

const claveGuardada = (): unknown => (history.state as Record<string, unknown> | null)?.[CLAVE_HISTORIAL];

// Cada paso del cuestionario es una entrada del historial: el botón Atrás del navegador vuelve al paso
// anterior en lugar de salir de la página. Las respuestas viven en el estado de la encuesta, no en el historial.
export function useHistorialPasos(paso: Paso, totalSecciones: number, irAPaso: (paso: Paso) => void) {
  useEffect(() => {
    const clave = clavePaso(paso);
    if (claveGuardada() === clave) return;
    const estado = { [CLAVE_HISTORIAL]: clave };
    // La primera entrada reemplaza a la de la pantalla de acceso; las demás se apilan.
    if (claveGuardada() === undefined) history.replaceState(estado, '');
    else history.pushState(estado, '');
  }, [paso]);

  useEffect(() => {
    const alRetroceder = (evento: PopStateEvent) => {
      const destino = pasoDesdeClave((evento.state as Record<string, unknown> | null)?.[CLAVE_HISTORIAL], totalSecciones);
      if (destino !== null) irAPaso(destino);
    };
    window.addEventListener('popstate', alRetroceder);
    return () => { window.removeEventListener('popstate', alRetroceder); };
  }, [totalSecciones, irAPaso]);
}
