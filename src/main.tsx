import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { aplicarTema, leerPreferenciaTema } from './app/use-tema';
import './styles/index.css';

// Antes del primer render, para que el tema guardado no parpadee.
aplicarTema(leerPreferenciaTema());

const raiz = document.getElementById('root');
if (raiz === null) throw new Error('index.html no tiene el elemento #root');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
