import type { ReactNode } from 'react';
import { useEntradaPaso } from './movimiento/use-entrada-paso';

interface PropsMarcoPaso {
  readonly titulo: string;
  // Texto pequeño sobre el título ("Sección 2 de 8"); null si el paso no lo lleva.
  readonly antetitulo: string | null;
  // Logo o abanico de hojas sobre el título en las pantallas de bienvenida y cierre.
  readonly ilustracion: ReactNode;
  readonly children: ReactNode;
}

// Cada paso tiene un h1 único que recibe el foco al entrar (AGENTS.md §5).
export function MarcoPaso({ titulo, antetitulo, ilustracion, children }: PropsMarcoPaso) {
  const encabezado = useEntradaPaso<HTMLHeadingElement>(titulo);
  const destacado = ilustracion !== null;
  return (
    <section aria-labelledby="titulo-paso" className="flex animate-paso flex-col gap-6">
      <div className={`flex flex-col gap-2 ${destacado ? 'items-center text-center' : ''}`}>
        {ilustracion}
        {antetitulo === null ? null : <p className="text-label text-muted">{antetitulo}</p>}
        <h1
          ref={encabezado}
          id="titulo-paso"
          tabIndex={-1}
          className={`${destacado ? 'font-display text-display' : 'text-heading'} text-titulo outline-none`}
        >
          {titulo}
        </h1>
      </div>
      {children}
    </section>
  );
}
