import { Description, FieldError, Input, Label, TextArea, TextField } from '@heroui/react';
import { SIN_AUTOCOMPLETADO } from '../sin-autocompletado';

interface PropsPreguntaTexto {
  readonly id: string;
  readonly etiqueta: string;
  readonly valor: string;
  readonly minimo: number;
  readonly limite: number;
  readonly multilinea: boolean;
  readonly invalida: boolean;
  readonly onCambiar: (texto: string) => void;
}

export function PreguntaTexto({ id, etiqueta, valor, minimo, limite, multilinea, invalida, onCambiar }: PropsPreguntaTexto) {
  return (
    <TextField
      id={`pregunta-${id}`}
      value={valor}
      onChange={onCambiar}
      maxLength={limite}
      isRequired
      isInvalid={invalida}
      fullWidth
      className="flex flex-col gap-2 rounded-lg bg-surface p-4"
    >
      <Label className="etiqueta-pregunta">{etiqueta}</Label>
      {multilinea ? <TextArea rows={4} className="min-h-28" {...SIN_AUTOCOMPLETADO} /> : <Input {...SIN_AUTOCOMPLETADO} />}
      <Description>
        Mínimo {minimo} caracteres · <span className="font-mono text-numeric">{valor.trim().length}</span> de{' '}
        <span className="font-mono text-numeric">{limite}</span>
      </Description>
      <FieldError>Escriba al menos {minimo} caracteres.</FieldError>
    </TextField>
  );
}
