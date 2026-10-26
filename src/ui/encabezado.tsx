import type { ReactNode } from 'react';
import { ProgresoHojas } from './progreso-hojas';

export interface Progreso {
  readonly completadas: number;
  readonly total: number;
}

interface PropsEncabezado {
  // null fuera del cuestionario (acceso, introducción, cierre).
  readonly progreso: Progreso | null;
  readonly apariencia: ReactNode;
}

// El logo vive solo en la pantalla de acceso; el encabezado nombra la encuesta.
export function Encabezado({ progreso, apariencia }: PropsEncabezado) {
  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-surface shadow-flotante">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 md:px-6">
        <span className="text-heading text-titulo">Diagnóstico EFR</span>
        <div className="flex items-center gap-x-6 gap-y-2">
          {progreso === null ? null : <ProgresoHojas completadas={progreso.completadas} total={progreso.total} />}
          {apariencia}
        </div>
      </div>
    </header>
  );
}
