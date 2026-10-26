import { Description, Input, Label, TextArea, TextField } from '@heroui/react';

interface PropsPreguntaTexto {
  readonly id: string;
  readonly etiqueta: string;
  readonly valor: string;
  readonly limite: number;
  readonly multilinea: boolean;
  readonly onCambiar: (texto: string) => void;
}

export function PreguntaTexto({ id, etiqueta, valor, limite, multilinea, onCambiar }: PropsPreguntaTexto) {
  return (
    <TextField
      id={`pregunta-${id}`}
      value={valor}
      onChange={onCambiar}
      maxLength={limite}
      fullWidth
      className="flex flex-col gap-2 rounded-lg bg-surface p-4"
    >
      <Label className="etiqueta-pregunta">{etiqueta}</Label>
      {multilinea ? <TextArea rows={4} className="min-h-28" /> : <Input />}
      <Description>
        Opcional · <span className="font-mono text-numeric">{valor.length}</span> de{' '}
        <span className="font-mono text-numeric">{limite}</span> caracteres
      </Description>
    </TextField>
  );
}
