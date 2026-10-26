import { Hoja } from './hoja';

interface PropsProgresoHojas {
  readonly completadas: number;
  readonly total: number;
}

// DESIGN.md Motion 2: cada hoja pasa de contorno a relleno al cerrar su dimensión.
// El texto lleva la información; las hojas son refuerzo visual.
export function ProgresoHojas({ completadas, total }: PropsProgresoHojas) {
  return (
    <p className="flex items-center gap-2">
      <span aria-hidden="true" className="flex gap-0.5 text-accent">
        {Array.from({ length: total }, (_, indice) => (
          <Hoja key={indice} rellena={indice < completadas} className="size-5" />
        ))}
      </span>
      <span className="text-body-sm text-muted">
        <span className="font-mono text-numeric">{completadas}</span> de{' '}
        <span className="font-mono text-numeric">{total}</span>
        <span className="sr-only md:not-sr-only"> dimensiones completadas</span>
      </span>
    </p>
  );
}
