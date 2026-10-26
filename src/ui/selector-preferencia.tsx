import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { useId } from 'react';
import type { Key } from 'react-aria-components';

export interface OpcionPreferencia<T extends string> {
  readonly id: T;
  readonly texto: string;
}

interface PropsSelectorPreferencia<T extends string> {
  readonly etiqueta: string;
  readonly opciones: readonly OpcionPreferencia<T>[];
  readonly valor: T;
  readonly esValido: (clave: unknown) => clave is T;
  readonly onCambiar: (valor: T) => void;
}

// Grupo de opciones excluyentes con etiqueta visible; sirve para el tema y para el tamaño de texto.
export function SelectorPreferencia<T extends string>({ etiqueta, opciones, valor, esValido, onCambiar }: PropsSelectorPreferencia<T>) {
  const idEtiqueta = useId();
  const alCambiar = (claves: Set<Key>) => {
    const [clave] = claves;
    if (esValido(clave)) onCambiar(clave);
  };
  return (
    <div className="flex flex-col gap-2">
      <span id={idEtiqueta} className="text-label">{etiqueta}</span>
      <ToggleButtonGroup className="flex-wrap justify-start" aria-labelledby={idEtiqueta} selectionMode="single" disallowEmptySelection isDetached selectedKeys={[valor]} onSelectionChange={alCambiar}>
        {opciones.map((opcion) => (
          <ToggleButton key={opcion.id} id={opcion.id}>{opcion.texto}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
