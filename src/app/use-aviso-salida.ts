import { useEffect } from 'react';

// Pide confirmación del navegador al cerrar o recargar la pestaña mientras haya respuestas sin enviar.
// El texto del aviso no es personalizable: los navegadores muestran el suyo.
export function useAvisoSalida(activo: boolean) {
  useEffect(() => {
    if (!activo) return undefined;
    const avisar = (evento: BeforeUnloadEvent) => { evento.preventDefault(); };
    window.addEventListener('beforeunload', avisar);
    return () => { window.removeEventListener('beforeunload', avisar); };
  }, [activo]);
}
