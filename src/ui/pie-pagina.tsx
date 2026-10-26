import type { PreferenciaTema } from '../app/tema';
import { LogoInstitucional } from './logo-institucional';
import { SelectorTema } from './selector-tema';

interface PropsPiePagina {
  readonly preferenciaTema: PreferenciaTema;
  readonly onCambiarTema: (preferencia: PreferenciaTema) => void;
}

// Datos institucionales tomados del pie de página del documento fuente (fuente-instrumentos-efr-hslv).
export function PiePagina({ preferenciaTema, onCambiarTema }: PropsPiePagina) {
  return (
    <footer className="mt-16 border-t border-separator bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <LogoInstitucional variante="encabezado" className="h-12 w-auto self-start" />
          <address className="text-body-sm text-muted not-italic">
            Calle 15 N° 17 A-196, La Ladera, Popayán, Cauca
            <br />
            www.hosusana.gov.co · Vigilado Supersalud
          </address>
        </div>
        <LogoInstitucional variante="sellos" className="h-auto w-full max-w-3xl self-center rounded-md" />
        <SelectorTema preferencia={preferenciaTema} onCambiar={onCambiarTema} />
      </div>
    </footer>
  );
}
