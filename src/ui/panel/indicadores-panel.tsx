import type { ResumenParticipacion } from '../../domain/panel/participacion';

const formatoPorcentaje = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

function Indicador({ etiqueta, valor }: { readonly etiqueta: string; readonly valor: string }) {
  return (
    <div className="tarjeta-panel flex flex-col gap-1">
      <dt className="text-label text-muted">{etiqueta}</dt>
      <dd className="font-mono text-heading text-titulo tabular-nums">{valor}</dd>
    </div>
  );
}

export function IndicadoresPanel({ resumen }: { readonly resumen: ResumenParticipacion }) {
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Indicador etiqueta="Respondieron" valor={`${String(resumen.respondieron)} de ${String(resumen.total)}`} />
      <Indicador etiqueta="Participación del personal de planta" valor={`${formatoPorcentaje.format(resumen.porcentaje)} %`} />
      <Indicador etiqueta="Envíos de hoy" valor={String(resumen.hoy)} />
      <Indicador etiqueta="Líderes" valor={String(resumen.lideres)} />
    </dl>
  );
}
