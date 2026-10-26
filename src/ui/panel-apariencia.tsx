import { Button, Popover } from '@heroui/react';
import { useState } from 'react';
import { esPreferenciaTema, type PreferenciaTema } from '../app/tema';
import { esTamanoTexto, type TamanoTexto } from '../app/tamano-texto';
import { IconoApariencia } from './icono-apariencia';
import { SelectorPreferencia, type OpcionPreferencia } from './selector-preferencia';

const OPCIONES_TEMA = [
  { id: 'claro', texto: 'Claro' },
  { id: 'oscuro', texto: 'Oscuro' },
  { id: 'sistema', texto: 'Según el dispositivo' },
] as const satisfies readonly OpcionPreferencia<PreferenciaTema>[];

const OPCIONES_TAMANO = [
  { id: 'normal', texto: 'Normal' },
  { id: 'grande', texto: 'Grande' },
  { id: 'muy-grande', texto: 'Muy grande' },
] as const satisfies readonly OpcionPreferencia<TamanoTexto>[];

interface PropsPanelApariencia {
  readonly tema: PreferenciaTema;
  readonly onCambiarTema: (tema: PreferenciaTema) => void;
  readonly tamano: TamanoTexto;
  readonly onCambiarTamano: (tamano: TamanoTexto) => void;
}

export function PanelApariencia({ tema, onCambiarTema, tamano, onCambiarTamano }: PropsPanelApariencia) {
  const [abierto, setAbierto] = useState(false);
  return (
    <Popover isOpen={abierto} onOpenChange={setAbierto}>
      <Button variant="outline" aria-label="Apariencia: tema de color y tamaño del texto" className="gap-2">
        <IconoApariencia abierto={abierto} />
        <span className="hidden sm:inline">Apariencia</span>
      </Button>
      <Popover.Content placement="bottom end" className="w-80 max-w-[calc(100vw-2rem)]">
        <Popover.Dialog className="flex flex-col gap-4 p-4" aria-label="Apariencia">
          <SelectorPreferencia etiqueta="Tema de color" opciones={OPCIONES_TEMA} valor={tema} esValido={esPreferenciaTema} onCambiar={onCambiarTema} />
          <SelectorPreferencia etiqueta="Tamaño del texto" opciones={OPCIONES_TAMANO} valor={tamano} esValido={esTamanoTexto} onCambiar={onCambiarTamano} />
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
