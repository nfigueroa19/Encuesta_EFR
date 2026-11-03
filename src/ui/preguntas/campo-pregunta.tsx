import { LIMITE_TEXTO, MINIMO_TEXTO, type Pregunta } from '../../domain/cuestionario';
import { ESCALA_LIKERT } from '../../domain/escala-likert';
import { SIN_OPCION, type ValorRespuesta } from '../../domain/respuestas';
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

// Cada pregunta es un contenedor: su disposición depende del ancho de la tarjeta y no del de la ventana.
export function CampoPregunta(props: PropsCampoPregunta) {
  return (
    <div className="@container/pregunta">
      <ControlPregunta {...props} />
    </div>
  );
}

function ControlPregunta({ pregunta, valor, invalida, onResponder }: PropsCampoPregunta) {
  const comunes = { id: pregunta.id, invalida };
  const opcion = valor?.tipo === 'opcion' ? valor.opcion : null;
  const elegir = (elegida: string | null) => {
    onResponder(pregunta, elegida === null ? SIN_OPCION : { tipo: 'opcion', opcion: elegida });
  };
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
      return <PreguntaTexto {...comunes} etiqueta={pregunta.enunciado} valor={texto} minimo={MINIMO_TEXTO['texto-corto']} limite={LIMITE_TEXTO['texto-corto']} multilinea={false} onCambiar={escribir} />;
    case 'texto-largo':
      return <PreguntaTexto {...comunes} etiqueta={conNumero(pregunta.numero, pregunta.enunciado)} valor={texto} minimo={MINIMO_TEXTO['texto-largo']} limite={LIMITE_TEXTO['texto-largo']} multilinea onCambiar={escribir} />;
  }
}
