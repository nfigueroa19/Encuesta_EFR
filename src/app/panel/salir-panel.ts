import { cerrarSesionPanel } from '../../data/sesion-panel';
import { irA, RUTAS_PANEL } from './rutas-panel';

// Archivo aparte para que la página de ingreso no cargue el código de consultas y tiempo real.
export async function salirDelPanel(): Promise<void> {
  await cerrarSesionPanel();
  irA(RUTAS_PANEL.ingreso);
}
