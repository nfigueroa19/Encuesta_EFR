import { Button } from '@heroui/react';
import type { ReactNode } from 'react';
import { DisenoPagina } from '../../ui/diseno-pagina';
import { PanelApariencia } from '../../ui/panel-apariencia';
import { PiePagina } from '../../ui/pie-pagina';
import { useTamanoTexto } from '../use-tamano-texto';
import { useTema } from '../use-tema';
import { salirDelPanel } from './salir-panel';

// Mismo encabezado y pie de la encuesta; en el panel, el encabezado suma el botón de salida.
export function MarcoPanel({ children, conSalida = true }: { readonly children: ReactNode; readonly conSalida?: boolean }) {
  const { preferencia, cambiarPreferencia } = useTema();
  const { tamano, cambiarTamano } = useTamanoTexto();
  const acciones = (
    <>
      {conSalida ? <Button variant="outline" onPress={() => { void salirDelPanel(); }}>Cerrar sesión</Button> : null}
      <PanelApariencia tema={preferencia} onCambiarTema={cambiarPreferencia} tamano={tamano} onCambiarTamano={cambiarTamano} />
    </>
  );
  return (
    <DisenoPagina progreso={null} apariencia={acciones} pie={<PiePagina />}>
      {children}
    </DisenoPagina>
  );
}
