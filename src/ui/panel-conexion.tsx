import { Alert, Button } from '@heroui/react';
import type { EstadoConexion } from '../domain/estado-conexion';

interface Presentacion {
  readonly status: 'default' | 'success' | 'warning' | 'danger';
  readonly titulo: string;
  readonly descripcion: string;
}

function describir(estado: EstadoConexion): Presentacion {
  switch (estado.tipo) {
    case 'verificando':
      return { status: 'default', titulo: 'Verificando la conexión con Supabase', descripcion: 'Consulta a la tabla personal con la clave publicable, sin traer filas.' };
    case 'protegida':
      return { status: 'success', titulo: 'Conexión activa y tabla personal protegida', descripcion: 'Supabase respondió y rechazó la lectura con la clave publicable (permiso denegado, código 42501). Los datos del personal no se pueden leer desde el navegador.' };
    case 'expuesta':
      return { status: 'danger', titulo: 'La tabla personal acepta lecturas con la clave publicable', descripcion: 'Retire el permiso SELECT del rol anon antes de continuar (regla AN-04).' };
    case 'sin-conexion':
      return { status: 'warning', titulo: 'Sin conexión con Supabase', descripcion: estado.detalle };
  }
}

interface PropsPanelConexion {
  readonly estado: EstadoConexion;
  readonly onVerificar: () => void;
}

export function PanelConexion({ estado, onVerificar }: PropsPanelConexion) {
  const presentacion = describir(estado);
  return (
    <section aria-labelledby="titulo-conexion" className="mx-auto flex w-full max-w-[65ch] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-conexion" className="text-heading text-titulo">Entorno de desarrollo</h2>
        <Button variant="outline" isPending={estado.tipo === 'verificando'} onPress={onVerificar}>Verificar de nuevo</Button>
      </div>
      <div aria-live="polite">
        <Alert key={estado.tipo} status={presentacion.status} className="animate-entrada">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{presentacion.titulo}</Alert.Title>
            <Alert.Description>{presentacion.descripcion}</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    </section>
  );
}
