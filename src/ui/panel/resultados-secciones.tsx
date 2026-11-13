import type { Pregunta, Seccion } from '../../domain/cuestionario';
import { ESCALA_LIKERT } from '../../domain/escala-likert';
import type { ConteoOpcion, TextoAbierto } from '../../domain/panel/datos-panel';
import { distribucion } from '../../domain/panel/distribucion';
import { ColumnasLikert, LeyendaLikert } from './columnas-likert';
import { BarrasOpciones } from './barras-opciones';
import { ListaTextos } from './lista-textos';

interface DatosRespuestas {
  readonly conteos: readonly ConteoOpcion[];
  readonly textos: readonly TextoAbierto[];
}

export function ResultadosSecciones({ secciones, datos }: { readonly secciones: readonly Seccion[]; readonly datos: DatosRespuestas }) {
  return (
    <section aria-labelledby="titulo-respuestas" className="flex flex-col gap-6">
      <h2 id="titulo-respuestas" className="text-heading text-titulo">Respuestas por pregunta</h2>
      <LeyendaLikert opciones={ESCALA_LIKERT} />
      {secciones.map((seccion) => (
        <section key={seccion.id} aria-labelledby={`seccion-${seccion.id}`} className="flex flex-col gap-3">
          <h3 id={`seccion-${seccion.id}`} className="text-label text-brand">{seccion.titulo}</h3>
          <ul className="flex flex-col gap-3">
            {seccion.preguntas.map((pregunta) => <ResultadoPregunta key={pregunta.id} pregunta={pregunta} datos={datos} />)}
          </ul>
        </section>
      ))}
    </section>
  );
}

function ResultadoPregunta({ pregunta, datos }: { readonly pregunta: Pregunta; readonly datos: DatosRespuestas }) {
  const numero = 'numero' in pregunta && pregunta.numero !== null ? `${String(pregunta.numero)}. ` : '';
  return (
    <li className="tarjeta-panel flex flex-col gap-3">
      <p className="text-body">{numero}{pregunta.enunciado}</p>
      <Visualizacion pregunta={pregunta} datos={datos} />
    </li>
  );
}

function Visualizacion({ pregunta, datos }: { readonly pregunta: Pregunta; readonly datos: DatosRespuestas }) {
  if (pregunta.tipo === 'likert') return <ColumnasLikert distribucion={distribucion(datos.conteos, pregunta.id, ESCALA_LIKERT)} />;
  if (pregunta.tipo === 'unica' || pregunta.tipo === 'multiple') {
    return <BarrasOpciones distribucion={distribucion(datos.conteos, pregunta.id, pregunta.opciones)} />;
  }
  const textos = datos.textos.filter((texto) => texto.preguntaId === pregunta.id).map((texto) => texto.texto);
  return <ListaTextos textos={textos} />;
}
