import { Button } from '@heroui/react';

export type EstadoEnVivo = 'conectando' | 'en-vivo' | 'sin-conexion';

const TEXTOS = {
  conectando: 'Conectando…',
  'en-vivo': 'En vivo: se actualiza con cada envío',
  'sin-conexion': 'Sin conexión en vivo: se actualiza cada minuto',
} as const satisfies Record<EstadoEnVivo, string>;

const hora = new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

interface PropsEstadoActualizacion {
  readonly enVivo: EstadoEnVivo;
  readonly actualizado: Date;
  readonly onActualizar: () => void;
}

export function EstadoActualizacion({ enVivo, actualizado, onActualizar }: PropsEstadoActualizacion) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="text-body-sm text-muted" aria-live="polite">
        <span aria-hidden="true" className={enVivo === 'en-vivo' ? 'text-brand' : 'text-warning'}>● </span>
        {TEXTOS[enVivo]}. Última actualización: {hora.format(actualizado)}.
      </p>
      <Button variant="outline" onPress={onActualizar}>Actualizar ahora</Button>
    </div>
  );
}
