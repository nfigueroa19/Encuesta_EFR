import { DisenoPagina } from '../ui/diseno-pagina';
import { PanelApariencia } from '../ui/panel-apariencia';
import { PantallaAcceso } from '../ui/pantallas/pantalla-acceso';
import { PantallaCierre } from '../ui/pantallas/pantalla-cierre';
import { PiePagina } from '../ui/pie-pagina';
import { DiagnosticoConexion } from './diagnostico-conexion';
import { Encuesta } from './encuesta';
import { useAcceso } from './use-acceso';
import { useTamanoTexto } from './use-tamano-texto';
import { useTema } from './use-tema';

export function App() {
  const { preferencia, cambiarPreferencia } = useTema();
  const { tamano, cambiarTamano } = useTamanoTexto();
  const acceso = useAcceso();
  const apariencia = <PanelApariencia tema={preferencia} onCambiarTema={cambiarPreferencia} tamano={tamano} onCambiarTamano={cambiarTamano} />;
  const pie = <PiePagina />;
  if (acceso.estado.tipo === 'habilitado') return <Encuesta cedula={acceso.estado.cedula} apariencia={apariencia} pie={pie} />;
  return (
    <DisenoPagina progreso={null} apariencia={apariencia} pie={pie}>
      {acceso.estado.tipo === 'ya-respondio' ? (
        <PantallaCierre motivo="ya-respondio" />
      ) : (
        <PantallaAcceso pendiente={acceso.pendiente} error={acceso.error} onIngresar={acceso.ingresar} />
      )}
      {import.meta.env.DEV ? <DiagnosticoConexion /> : null}
    </DisenoPagina>
  );
}
