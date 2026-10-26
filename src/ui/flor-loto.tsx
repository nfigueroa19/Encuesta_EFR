// Flor de loto del logo del HSLV, dibujada como cinco pétalos que giran sobre una misma base.
const PETALO = 'M12 21C8.2 17 8.2 9.5 12 4C15.8 9.5 15.8 17 12 21Z';
const PETALOS = [
  { giro: -58, escala: 0.8 },
  { giro: 58, escala: 0.8 },
  { giro: -29, escala: 0.92 },
  { giro: 29, escala: 0.92 },
  { giro: 0, escala: 1 },
] as const;

export function FlorLoto({ className }: { readonly className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      {PETALOS.map(({ giro, escala }) => (
        <path
          key={giro}
          d={PETALO}
          transform={`rotate(${String(giro)} 12 21) translate(12 21) scale(${String(escala)}) translate(-12 -21)`}
          fill="var(--efr-leaf)"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
