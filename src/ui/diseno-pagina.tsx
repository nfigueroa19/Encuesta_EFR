import type { ReactNode } from 'react';
import { Encabezado, type Progreso } from './encabezado';

interface PropsDisenoPagina {
  readonly progreso: Progreso | null;
  readonly apariencia: ReactNode;
  readonly pie: ReactNode;
  readonly children: ReactNode;
}

export function DisenoPagina({ progreso, apariencia, pie, children }: PropsDisenoPagina) {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3">
        Ir al contenido
      </a>
      <Encabezado progreso={progreso} apariencia={apariencia} />
      {/* overflow-x-clip: la entrada de cada paso (DESIGN.md Motion 4) desplaza 24 px y no debe crear barra horizontal. */}
      <main id="contenido" tabIndex={-1} className="mx-auto flex w-full max-w-content flex-col gap-12 overflow-x-clip px-4 py-10 outline-none md:px-6 lg:px-10">
        {children}
      </main>
      {pie}
    </>
  );
}
