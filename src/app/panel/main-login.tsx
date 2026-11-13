import { PantallaIngreso } from '../../ui/panel/pantalla-ingreso';
import { MarcoPanel } from './marco-panel';
import { montar } from './montar';
import { useIngreso } from './use-ingreso';

function PaginaIngreso() {
  const { pendiente, error, ingresar } = useIngreso();
  return (
    <MarcoPanel conSalida={false}>
      <PantallaIngreso pendiente={pendiente} error={error} onIngresar={ingresar} />
    </MarcoPanel>
  );
}

montar(<PaginaIngreso />);
