import type { NivelSemaforo } from '../../domain/panel/puntaje-efr';
import type { ResultadoDimension } from '../../domain/panel/resultado-dimensiones';

const formato = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 });

// El nivel va siempre en texto; el color y el símbolo lo refuerzan (WCAG 1.4.1).
const NIVELES = {
  critico: { texto: 'Crítico', simbolo: '▼▼', clase: 'text-danger' },
  bajo: { texto: 'Bajo', simbolo: '▼', clase: 'text-danger' },
  'en-desarrollo': { texto: 'En desarrollo', simbolo: '●', clase: 'text-warning' },
  consolidado: { texto: 'Consolidado', simbolo: '▲', clase: 'text-brand' },
  avanzado: { texto: 'Avanzado', simbolo: '▲▲', clase: 'text-brand' },
} as const satisfies Record<NivelSemaforo, { texto: string; simbolo: string; clase: string }>;

export function TarjetasDimensiones({ resultados }: { readonly resultados: readonly ResultadoDimension[] }) {
  return (
    <section aria-labelledby="titulo-dimensiones" className="flex flex-col gap-3">
      <h2 id="titulo-dimensiones" className="text-heading text-titulo">Resultado por dimensión</h2>
      <p className="text-body-sm text-muted">
        Preliminar: solo la voz del colaborador (Instrumento A), con Totalmente de acuerdo = 5 y Totalmente en desacuerdo = 1.
        Falta la ponderación con la evidencia institucional y la voz de líderes.
      </p>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {resultados.map((resultado) => <TarjetaDimension key={resultado.dimension} resultado={resultado} />)}
      </ul>
    </section>
  );
}

function TarjetaDimension({ resultado }: { readonly resultado: ResultadoDimension }) {
  const nivel = resultado.nivel === null ? null : NIVELES[resultado.nivel];
  return (
    <li className="tarjeta-panel flex flex-col gap-1">
      <span className="text-label text-muted">Dimensión {String(resultado.dimension)}</span>
      <span className="text-body">{resultado.titulo}</span>
      <span className="font-mono text-heading text-titulo tabular-nums">
        {resultado.porcentaje === null ? 'Sin datos' : `${formato.format(resultado.porcentaje)} %`}
      </span>
      {nivel === null ? null : <span className={`text-label ${nivel.clase}`}><span aria-hidden="true">{nivel.simbolo} </span>{nivel.texto}</span>}
    </li>
  );
}
