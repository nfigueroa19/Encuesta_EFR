import { Button, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';
import type { Envio } from '../../domain/panel/datos-panel';
import { filtrarEnvios } from '../../domain/panel/participacion';

const formatoCedula = new Intl.NumberFormat('es-CO');

interface PropsTablaEnvios {
  readonly envios: readonly Envio[];
  readonly onExportar: () => void;
}

export function TablaEnvios({ envios, onExportar }: PropsTablaEnvios) {
  const [busqueda, setBusqueda] = useState('');
  const visibles = filtrarEnvios(envios, busqueda);
  return (
    <section aria-labelledby="titulo-envios" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-envios" className="text-heading text-titulo">Envíos recibidos</h2>
        <Button variant="outline" onPress={onExportar}>Descargar Excel</Button>
      </div>
      <TextField value={busqueda} onChange={setBusqueda} className="w-full max-w-md">
        <Label>Buscar por cédula o nombre</Label>
        <Input type="search" autoComplete="off" spellCheck={false} />
      </TextField>
      <p className="text-body-sm text-muted" aria-live="polite">
        {busqueda.trim() === '' ? `${String(envios.length)} envíos` : `${String(visibles.length)} de ${String(envios.length)} envíos coinciden`}
      </p>
      {visibles.length === 0 ? <p className="text-body-sm">Ningún envío coincide con la búsqueda.</p> : <Tabla envios={visibles} />}
    </section>
  );
}

function Tabla({ envios }: { readonly envios: readonly Envio[] }) {
  return (
    <div className="tarjeta-panel overflow-x-auto p-0">
      <table className="tabla-envios">
        <caption className="sr-only">Personas que enviaron la encuesta, de la más reciente a la más antigua</caption>
        <thead>
          <tr><th scope="col">Cédula</th><th scope="col">Nombre</th><th scope="col">Líder</th><th scope="col">Fecha de envío</th></tr>
        </thead>
        <tbody>{envios.map((envio) => <FilaEnvio key={envio.cedula} envio={envio} />)}</tbody>
      </table>
    </div>
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
