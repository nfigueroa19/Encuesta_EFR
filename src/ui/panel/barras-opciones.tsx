import type { Distribucion } from '../../domain/panel/distribucion';

const formato = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

// Una barra por opción, en el orden del cuestionario. En selección múltiple cada barra es
// el porcentaje de personas que marcaron esa opción.
export function BarrasOpciones({ distribucion }: { readonly distribucion: Distribucion }) {
  return (
    <ul className="flex flex-col gap-2">
      {distribucion.opciones.map((item) => (
        <li key={item.opcion.id} className="grid grid-cols-[minmax(0,14rem)_1fr_auto] items-center gap-3 text-body-sm">
          <span>{item.opcion.texto}</span>
          <div className="barra-pista" aria-hidden="true">
            <div className="barra-relleno" style={{ width: `${String(item.porcentaje)}%` }} />
          </div>
          <span className="font-mono tabular-nums">{formato.format(item.porcentaje)} % ({String(item.total)})</span>
        </li>
      ))}
    </ul>
  );
}
