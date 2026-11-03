import { LogoInstitucional } from './logo-institucional';

// Datos institucionales tomados del pie de página del documento fuente (fuente-instrumentos-efr-hslv).
export function PiePagina() {
  return (
    <footer className="mt-16 border-t border-separator bg-surface">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-4 py-8 text-center md:px-6 lg:px-10">
        <p className="text-body-sm text-muted">Desarrollado por el área de Talento Humano y la Unidad de Inteligencia Artificial</p>
        <address className="text-body-sm text-muted not-italic">
          Hospital Susana López de Valencia E.S.E.
          <br />
          Calle 15 N° 17 A-196, La Ladera, Popayán, Cauca
          <br />
          Vigilado Supersalud
        </address>
        <LogoInstitucional variante="sellos" className="h-auto w-full max-w-3xl rounded-md" />
      </div>
    </footer>
  );
}
