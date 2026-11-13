import type { Opcion } from '../../domain/cuestionario';
import type { Distribucion, PorcentajeOpcion } from '../../domain/panel/distribucion';

const formato = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

// Color por opción, no por posición: la leyenda y cada columna usan el mismo mapa (panel.css).
const COLOR_OPCION: Readonly<Record<string, string>> = {
  'totalmente-de-acuerdo': 'var(--efr-likert-5)',
  'de-acuerdo': 'var(--efr-likert-4)',
  'parcialmente-de-acuerdo': 'var(--efr-likert-3)',
  'en-desacuerdo': 'var(--efr-likert-2)',
  'totalmente-en-desacuerdo': 'var(--efr-likert-1)',
};

const colorDe = (opcion: Opcion) => COLOR_OPCION[opcion.id] ?? 'var(--border)';

function Muestra({ opcion }: { readonly opcion: Opcion }) {
  return <span aria-hidden="true" className="mt-1 inline-block size-3 shrink-0 rounded-sm" style={{ background: colorDe(opcion) }} />;
}

// Columnas verticales en el orden del cuestionario, con el nombre de la opción bajo cada columna.
export function ColumnasLikert({ distribucion }: { readonly distribucion: Distribucion }) {
  return (
    <ul className="grafica-columnas">
      {distribucion.opciones.map((item) => <Columna key={item.opcion.id} item={item} />)}
    </ul>
  );
}

function Columna({ item }: { readonly item: PorcentajeOpcion }) {
  return (
    <li>
      <span className="flex flex-col">
        <span className="font-mono text-label tabular-nums">{formato.format(item.porcentaje)} %</span>
        <span className="text-body-sm text-muted">{String(item.total)} {item.total === 1 ? 'persona' : 'personas'}</span>
      </span>
      <div className="columna-pista" aria-hidden="true">
        <div className="columna-relleno" style={{ height: `${String(item.porcentaje)}%`, background: colorDe(item.opcion) }} />
      </div>
      <span className="columna-nombre flex flex-col items-center gap-1 text-body-sm"><Muestra opcion={item.opcion} />{item.opcion.texto}</span>
    </li>
  );
}

export function LeyendaLikert({ opciones }: { readonly opciones: readonly Opcion[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm" aria-label="Color de cada opción en las gráficas">
      {opciones.map((opcion) => (
        <li key={opcion.id} className="flex items-start gap-2"><Muestra opcion={opcion} />{opcion.texto}</li>
      ))}
    </ul>
  );
}
