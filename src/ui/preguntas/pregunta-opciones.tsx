import { FieldError, Label, Radio, RadioGroup } from '@heroui/react';
import type { Opcion } from '../../domain/cuestionario';
import { FlorLoto } from '../flor-loto';

interface PropsPreguntaOpciones {
  readonly id: string;
  readonly etiqueta: string;
  readonly opciones: readonly Opcion[];
  readonly valor: string | null;
  readonly invalida: boolean;
  // likert: matriz de cinco columnas en escritorio (DESIGN.md Layout); lista: rejilla flexible.
  readonly disposicion: 'likert' | 'lista';
  // null: la persona quitó la opción marcada.
  readonly onCambiar: (opcion: string | null) => void;
}

const REJILLA = { likert: 'grid gap-2 @xl/pregunta:grid-cols-5', lista: 'grid gap-2 @md/pregunta:grid-cols-2 @3xl/pregunta:grid-cols-3' } as const;

export function PreguntaOpciones({ id, etiqueta, opciones, valor, invalida, disposicion, onCambiar }: PropsPreguntaOpciones) {
  const fila = disposicion === 'likert' ? '@5xl/pregunta:grid @5xl/pregunta:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @5xl/pregunta:items-center @5xl/pregunta:gap-6' : '';
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
        {opciones.map((opcion) => (
          <OpcionRadio
            key={opcion.id}
            opcion={opcion}
            columna={disposicion === 'likert'}
            seleccionada={opcion.id === valor}
            onQuitar={() => { onCambiar(null); }}
          />
        ))}
      </div>
      <FieldError className="@5xl/pregunta:col-span-2">Seleccione una opción.</FieldError>
    </RadioGroup>
  );
}

interface PropsOpcionRadio {
  readonly opcion: Opcion;
  readonly columna: boolean;
  readonly seleccionada: boolean;
  readonly onQuitar: () => void;
}

// DESIGN.md Motion 1: al elegir, una flor de loto brota desde el centro del control.
// Un radio ya marcado no emite cambio: el clic lo quita. Con el ratón llega al texto, no al input; con la barra
// espaciadora llega al input. Quitar es idempotente, así que un doble aviso no cambia el resultado.
function OpcionRadio({ opcion, columna, seleccionada, onQuitar }: PropsOpcionRadio) {
  const alPulsar = () => {
    if (seleccionada) onQuitar();
  };
  return (
    <Radio value={opcion.id} onClick={alPulsar} className={`opcion-respuesta ${columna ? 'opcion-respuesta--columna' : ''}`}>
      <Radio.Content>
        <Radio.Control>
          <Radio.Indicator>
            {({ isSelected }) => (isSelected ? <FlorLoto className="size-6 animate-brotar text-brand" /> : null)}
          </Radio.Indicator>
        </Radio.Control>
        <span>{opcion.texto}</span>
      </Radio.Content>
    </Radio>
  );
}
