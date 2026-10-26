import { Checkbox, CheckboxGroup, Description, FieldError, Label } from '@heroui/react';
import type { Opcion } from '../../domain/cuestionario';

interface PropsPreguntaMultiple {
  readonly id: string;
  readonly etiqueta: string;
  readonly opciones: readonly Opcion[];
  readonly valor: readonly string[];
  readonly invalida: boolean;
  readonly onCambiar: (opciones: readonly string[]) => void;
}

export function PreguntaMultiple({ id, etiqueta, opciones, valor, invalida, onCambiar }: PropsPreguntaMultiple) {
  return (
    <CheckboxGroup
      id={`pregunta-${id}`}
      value={[...valor]}
      onChange={onCambiar}
      isInvalid={invalida}
      isRequired
      validationBehavior="aria"
      className="flex flex-col gap-3 rounded-lg bg-surface p-4"
    >
      <Label className="etiqueta-pregunta">{etiqueta}</Label>
      <Description>Puede marcar varias opciones.</Description>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {opciones.map((opcion) => (
          <Checkbox key={opcion.id} value={opcion.id} className="opcion-respuesta">
            <Checkbox.Content>
              <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
              <span>{opcion.texto}</span>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </div>
      <FieldError>Seleccione al menos una opción.</FieldError>
    </CheckboxGroup>
  );
}
