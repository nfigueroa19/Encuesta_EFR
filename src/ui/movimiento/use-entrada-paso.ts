import { useEffect, useRef } from 'react';

// Al entrar a un paso: título de pestaña único y foco en el h1 para que el lector de pantalla
// anuncie el cambio (AGENTS.md §5). El desplazamiento y fundido (DESIGN.md Motion 4) es la
// clase animate-paso en CSS: avanza por tiempo aunque el equipo entregue pocos cuadros por segundo.
export function useEntradaPaso<T extends HTMLElement>(titulo: string) {
  const encabezado = useRef<T>(null);

  useEffect(() => {
    document.title = `${titulo} · Diagnóstico EFR HSLV`;
    encabezado.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [titulo]);

  return encabezado;
}
