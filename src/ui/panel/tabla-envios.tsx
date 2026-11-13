import { Button } from '@heroui/react';
import type { Envio } from '../../domain/panel/datos-panel';

const formatoCedula = new Intl.NumberFormat('es-CO');

interface PropsTablaEnvios {
  readonly envios: readonly Envio[];
  readonly onExportar: () => void;
}

export function TablaEnvios({ envios, onExportar }: PropsTablaEnvios) {
  return (
    <section aria-labelledby="titulo-envios" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-envios" className="text-heading text-titulo">Envíos recibidos</h2>
        <Button variant="outline" onPress={onExportar}>Descargar CSV</Button>
      </div>
      <div className="tarjeta-panel overflow-x-auto p-0">
        <table className="tabla-envios">
          <caption className="sr-only">Personas que enviaron la encuesta, de la más reciente a la más antigua</caption>
          <thead>
            <tr><th scope="col">Cédula</th><th scope="col">Nombre</th><th scope="col">Líder</th><th scope="col">Fecha de envío</th></tr>
          </thead>
          <tbody>{envios.map((envio) => <FilaEnvio key={envio.cedula} envio={envio} />)}</tbody>
        </table>
      </div>
    </section>
  );
}

function FilaEnvio({ envio }: { readonly envio: Envio }) {
  return (
    <tr>
      <td className="numero">{formatoCedula.format(envio.cedula)}</td>
      <td>{envio.nombre ?? <span className="text-muted">No está en el registro de personal</span>}</td>
      <td>{envio.respondioLideres ? 'Sí' : 'No'}</td>
      <td className="numero">{envio.enviadoEl}</td>
    </tr>
  );
}
