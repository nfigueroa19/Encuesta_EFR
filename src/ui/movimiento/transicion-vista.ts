import { CONSULTA_MOVIMIENTO_REDUCIDO } from './tokens';

// DESIGN.md Motion 6: el cambio de tema se revela en círculo desde el botón de apariencia (styles/componentes.css).
// Sin View Transitions API (Firefox sin soporte confirmado) o con movimiento reducido, el cambio es instantáneo.
export function conTransicionDeVista(cambio: () => void): void {
  const reducido = window.matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches;
  if (reducido || typeof document.startViewTransition !== 'function') {
    cambio();
    return;
  }
  document.startViewTransition(cambio);
}
