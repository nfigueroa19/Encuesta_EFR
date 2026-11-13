import { inicioBarraDivergente, type Distribucion } from '../../domain/panel/distribucion';

const formato = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

// La escala del catálogo va de acuerdo a desacuerdo; la barra se dibuja de desacuerdo a acuerdo.
export function BarraLikert({ distribucion }: { readonly distribucion: Distribucion }) {
  const items = [...distribucion.opciones].reverse();
  const inicio = inicioBarraDivergente(items);
  return (
    <div className="flex flex-col gap-2">
      <div className="relative" aria-hidden="true">
        <div className="barra-segmentos" style={{ marginLeft: `${String(inicio)}%`, width: '50%' }}>
          {items.map((item, indice) => (
            <span key={item.opcion.id} title={`${item.opcion.texto}: ${formato.format(item.porcentaje)} %`}
              style={{ width: `${String(item.porcentaje)}%`, background: `var(--efr-likert-${String(indice + 1)})` }} />
          ))}
        </div>
        <span className="linea-centro" />
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-muted">
        {items.map((item) => (
          <li key={item.opcion.id}>{item.opcion.texto}: <span className="font-mono tabular-nums">{formato.format(item.porcentaje)} % ({String(item.total)})</span></li>
        ))}
      </ul>
    </div>
  );
}

export function LeyendaLikert({ textos }: { readonly textos: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-muted" aria-label="Colores de la escala">
      {textos.map((texto, indice) => (
        <li key={texto} className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-3 rounded-sm" style={{ background: `var(--efr-likert-${String(indice + 1)})` }} />
          {texto}
        </li>
      ))}
    </ul>
  );
}
