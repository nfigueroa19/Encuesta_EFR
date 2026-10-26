import { DisenoPagina } from '../ui/diseno-pagina';
import { PantallaAcceso } from '../ui/pantallas/pantalla-acceso';
import { PantallaCierre } from '../ui/pantallas/pantalla-cierre';
import { PiePagina } from '../ui/pie-pagina';
import { DiagnosticoConexion } from './diagnostico-conexion';
import { Encuesta } from './encuesta';
import { useAcceso } from './use-acceso';
import { useTema } from './use-tema';

export function App() {
  const { preferencia, cambiarPreferencia } = useTema();
  const acceso = useAcceso();
  const pie = <PiePagina preferenciaTema={preferencia} onCambiarTema={cambiarPreferencia} />;
  if (acceso.estado.tipo === 'habilitado') return <Encuesta cedula={acceso.estado.cedula} pie={pie} />;
  return (
    <DisenoPagina progreso={null} pie={pie}>
      {acceso.estado.tipo === 'ya-respondio' ? (
        <PantallaCierre motivo="ya-respondio" />
      ) : (
        <PantallaAcceso pendiente={acceso.pendiente} error={acceso.error} onIngresar={acceso.ingresar} />
      )}
      {import.meta.env.DEV ? <DiagnosticoConexion /> : null}
    </DisenoPagina>
  );
}
