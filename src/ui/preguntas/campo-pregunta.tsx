import { LIMITE_TEXTO, type Pregunta } from '../../domain/cuestionario';
import { ESCALA_LIKERT } from '../../domain/escala-likert';
import type { ValorRespuesta } from '../../domain/respuestas';
import { PreguntaMultiple } from './pregunta-multiple';
import { PreguntaOpciones } from './pregunta-opciones';
import { PreguntaTexto } from './pregunta-texto';

export interface PropsCampoPregunta {
  readonly pregunta: Pregunta;
  readonly valor: ValorRespuesta | undefined;
  readonly invalida: boolean;
  readonly onResponder: (pregunta: Pregunta, valor: ValorRespuesta) => void;
}

const conNumero = (numero: number | null, enunciado: string) => (numero === null ? enunciado : `${String(numero)}. ${enunciado}`);

export function CampoPregunta({ pregunta, valor, invalida, onResponder }: PropsCampoPregunta) {
  const comunes = { id: pregunta.id, invalida };
  const opcion = valor?.tipo === 'opcion' ? valor.opcion : null;
  const elegir = (elegida: string) => { onResponder(pregunta, { tipo: 'opcion', opcion: elegida }); };
  const escribir = (texto: string) => { onResponder(pregunta, { tipo: 'texto', texto }); };
  const texto = valor?.tipo === 'texto' ? valor.texto : '';
  switch (pregunta.tipo) {
    case 'likert':
      return <PreguntaOpciones {...comunes} etiqueta={conNumero(pregunta.numero, pregunta.enunciado)} opciones={ESCALA_LIKERT} valor={opcion} disposicion="likert" onCambiar={elegir} />;
    case 'unica':
      return <PreguntaOpciones {...comunes} etiqueta={pregunta.enunciado} opciones={pregunta.opciones} valor={opcion} disposicion="lista" onCambiar={elegir} />;
    case 'multiple':
      return (
        <PreguntaMultiple {...comunes} etiqueta={pregunta.enunciado} opciones={pregunta.opciones}
          valor={valor?.tipo === 'opciones' ? valor.opciones : []}
          onCambiar={(opciones) => { onResponder(pregunta, { tipo: 'opciones', opciones }); }} />
      );
    case 'texto-corto':
      return <PreguntaTexto id={pregunta.id} etiqueta={pregunta.enunciado} valor={texto} limite={LIMITE_TEXTO['texto-corto']} multilinea={false} onCambiar={escribir} />;
    case 'texto-largo':
      return <PreguntaTexto id={pregunta.id} etiqueta={conNumero(pregunta.numero, pregunta.enunciado)} valor={texto} limite={LIMITE_TEXTO['texto-largo']} multilinea onCambiar={escribir} />;
  }
}
