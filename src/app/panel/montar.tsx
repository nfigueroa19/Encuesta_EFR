import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { aplicarTamanoTexto, leerTamanoTexto } from '../use-tamano-texto';
import { aplicarTema, leerPreferenciaTema } from '../use-tema';
import '../../styles/index.css';
import '../../styles/panel.css';

// Igual que src/main.tsx: tema y tamaño antes del primer render para que no parpadeen.
export function montar(contenido: ReactNode): void {
  aplicarTema(leerPreferenciaTema());
  aplicarTamanoTexto(leerTamanoTexto());
  const raiz = document.getElementById('root');
  if (raiz === null) throw new Error('La página no tiene el elemento #root');
  createRoot(raiz).render(<StrictMode>{contenido}</StrictMode>);
}
