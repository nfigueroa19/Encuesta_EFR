// Motivo de hoja de DESIGN.md (Shapes). Forma provisional hasta recibir el logo vectorial del HSLV.
const CONTORNO = 'M12 2C18 7 18 17 12 22C6 17 6 7 12 2Z';
const NERVIO = 'M12 7V20.5';

interface PropsHoja {
  readonly rellena: boolean;
  readonly className: string;
}

export function Hoja({ rellena, className }: PropsHoja) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        d={CONTORNO}
        fill="var(--efr-leaf)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ fillOpacity: rellena ? 1 : 0 }}
        className="transition-[fill-opacity] duration-(--motion-slow) ease-standard"
      />
      <path d={NERVIO} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
    </svg>
  );
}
