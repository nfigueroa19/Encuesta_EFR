import { PanelConexion } from '../ui/panel-conexion';
import { useSondaPersonal } from './use-sonda-personal';

// Solo en desarrollo: App lo monta tras import.meta.env.DEV y Vite lo elimina del build.
export function DiagnosticoConexion() {
  const { estado, verificar } = useSondaPersonal();
  return <PanelConexion estado={estado} onVerificar={verificar} />;
}
