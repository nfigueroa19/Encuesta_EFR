import type { Pregunta, Seccion } from './cuestionario';
import { PASO_INICIAL, transicion, type Evento, type Paso } from './flujo';
import { SECCIONES_INSTRUMENTO_A } from './instrumento-a';
import { SECCION_LIDERES } from './instrumento-b';
import { registrarRespuesta, SIN_RESPUESTAS, type Respuestas, type ValorRespuesta } from './respuestas';

export interface EstadoEncuesta {
  readonly paso: Paso;
  readonly respuestas: Respuestas;
}

export type AccionEncuesta =
  | { readonly tipo: 'evento'; readonly evento: Evento }
  | { readonly tipo: 'responder'; readonly pregunta: Pregunta; readonly valor: ValorRespuesta };

export const ESTADO_INICIAL: EstadoEncuesta = { paso: PASO_INICIAL, respuestas: SIN_RESPUESTAS };

export function reducirEncuesta(estado: EstadoEncuesta, accion: AccionEncuesta): EstadoEncuesta {
  if (accion.tipo === 'evento') {
    return { ...estado, paso: transicion(estado.paso, accion.evento, SECCIONES_INSTRUMENTO_A.length) };
  }
  return { ...estado, respuestas: registrarRespuesta(estado.respuestas, accion.pregunta, accion.valor) };
}

// Secciones que viajan al servidor: el Instrumento B solo si la persona eligió responderlo.
export function seccionesDelEnvio(respondioLideres: boolean): readonly Seccion[] {
  return respondioLideres ? [...SECCIONES_INSTRUMENTO_A, SECCION_LIDERES] : SECCIONES_INSTRUMENTO_A;
}

// Sección en pantalla para los pasos de cuestionario; null en introducción, decisión y cierre.
export function seccionDelPaso(paso: Paso): Seccion | null {
  if (paso.tipo === 'seccion') return SECCIONES_INSTRUMENTO_A[paso.indice] ?? null;
  return paso.tipo === 'lideres' ? SECCION_LIDERES : null;
}
