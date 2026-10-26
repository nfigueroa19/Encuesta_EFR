import { FieldError, Label, Radio, RadioGroup } from '@heroui/react';
import type { Opcion } from '../../domain/cuestionario';
import { Hoja } from '../hoja';

interface PropsPreguntaOpciones {
  readonly id: string;
  readonly etiqueta: string;
  readonly opciones: readonly Opcion[];
  readonly valor: string | null;
  readonly invalida: boolean;
  // likert: matriz de cinco columnas en escritorio (DESIGN.md Layout); lista: rejilla flexible.
  readonly disposicion: 'likert' | 'lista';
  readonly onCambiar: (opcion: string) => void;
}

const REJILLA = { likert: 'grid gap-2 lg:grid-cols-5', lista: 'grid gap-2 sm:grid-cols-2 lg:grid-cols-3' } as const;

export function PreguntaOpciones({ id, etiqueta, opciones, valor, invalida, disposicion, onCambiar }: PropsPreguntaOpciones) {
  const fila = disposicion === 'likert' ? 'lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-6' : '';
  return (
    <RadioGroup
      id={`pregunta-${id}`}
      value={valor}
      onChange={onCambiar}
      isInvalid={invalida}
      isRequired
      validationBehavior="aria"
      className={`flex flex-col gap-3 rounded-lg bg-surface p-4 ${fila}`}
    >
      <Label className="etiqueta-pregunta">{etiqueta}</Label>
      <div className={REJILLA[disposicion]}>
        {opciones.map((opcion) => <OpcionRadio key={opcion.id} opcion={opcion} columna={disposicion === 'likert'} />)}
      </div>
      <FieldError className="lg:col-span-2">Seleccione una opción.</FieldError>
    </RadioGroup>
  );
}

// DESIGN.md Motion 1: al elegir, una hoja brota desde el centro del control.
function OpcionRadio({ opcion, columna }: { readonly opcion: Opcion; readonly columna: boolean }) {
  return (
    <Radio value={opcion.id} className={`opcion-respuesta ${columna ? 'opcion-respuesta--columna' : ''}`}>
      <Radio.Content>
        <Radio.Control>
          <Radio.Indicator>
            {({ isSelected }) => (isSelected ? <Hoja rellena className="size-6 animate-brotar text-brand" /> : null)}
          </Radio.Indicator>
        </Radio.Control>
        <span>{opcion.texto}</span>
      </Radio.Content>
    </Radio>
  );
}
