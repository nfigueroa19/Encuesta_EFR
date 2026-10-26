import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { useId } from 'react';
import type { Key } from 'react-aria-components';
import { esPreferenciaTema, type PreferenciaTema } from '../app/tema';

const OPCIONES = [
  { id: 'claro', texto: 'Claro' },
  { id: 'oscuro', texto: 'Oscuro' },
  { id: 'sistema', texto: 'Según el dispositivo' },
] as const satisfies readonly { id: PreferenciaTema; texto: string }[];

interface PropsSelectorTema {
  readonly preferencia: PreferenciaTema;
  readonly onCambiar: (preferencia: PreferenciaTema) => void;
}

export function SelectorTema({ preferencia, onCambiar }: PropsSelectorTema) {
  const idEtiqueta = useId();
  const alCambiar = (claves: Set<Key>) => {
    const [clave] = claves;
    if (esPreferenciaTema(clave)) onCambiar(clave);
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span id={idEtiqueta} className="text-label">Tema de color</span>
      <ToggleButtonGroup className="flex-wrap" aria-labelledby={idEtiqueta} selectionMode="single" disallowEmptySelection isDetached selectedKeys={[preferencia]} onSelectionChange={alCambiar}>
        {OPCIONES.map((opcion) => (
          <ToggleButton key={opcion.id} id={opcion.id}>{opcion.texto}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
