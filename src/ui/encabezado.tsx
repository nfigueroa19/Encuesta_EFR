import { LogoInstitucional } from './logo-institucional';
import { ProgresoHojas } from './progreso-hojas';

export interface Progreso {
  readonly completadas: number;
  readonly total: number;
}

interface PropsEncabezado {
  // null fuera del cuestionario (acceso, introducción, cierre).
  readonly progreso: Progreso | null;
}

export function Encabezado({ progreso }: PropsEncabezado) {
  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-surface shadow-flotante">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 md:px-6">
        <div className="flex items-center gap-4">
          <LogoInstitucional variante="encabezado" className="h-10 w-auto md:h-12" />
          <span className="hidden border-l border-separator pl-4 text-label text-titulo sm:block">Diagnóstico EFR</span>
        </div>
        {progreso === null ? null : <ProgresoHojas completadas={progreso.completadas} total={progreso.total} />}
      </div>
    </header>
  );
}
