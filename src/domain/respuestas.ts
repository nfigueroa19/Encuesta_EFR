import { esObligatoria, type Pregunta, type Seccion } from './cuestionario';

export type ValorRespuesta =
  | { readonly tipo: 'opcion'; readonly opcion: string }
  | { readonly tipo: 'opciones'; readonly opciones: readonly string[] }
  | { readonly tipo: 'texto'; readonly texto: string };

export type Respuestas = ReadonlyMap<string, ValorRespuesta>;

export const SIN_RESPUESTAS: Respuestas = new Map();

export function esVisible(pregunta: Pregunta, respuestas: Respuestas): boolean {
  if (pregunta.tipo !== 'texto-corto' || pregunta.visibleSi === null) return true;
  const condicion = respuestas.get(pregunta.visibleSi.pregunta);
  return condicion?.tipo === 'opcion' && condicion.opcion === pregunta.visibleSi.opcion;
}

function estaRespondida(valor: ValorRespuesta | undefined): boolean {
  if (valor === undefined) return false;
  if (valor.tipo === 'opciones') return valor.opciones.length > 0;
  if (valor.tipo === 'texto') return valor.texto.trim().length > 0;
  return true;
}

export function preguntasFaltantes(seccion: Seccion, respuestas: Respuestas): readonly Pregunta[] {
  return seccion.preguntas.filter(
    (pregunta) => esObligatoria(pregunta) && esVisible(pregunta, respuestas) && !estaRespondida(respuestas.get(pregunta.id)),
  );
}

export function seccionCompleta(seccion: Seccion, respuestas: Respuestas): boolean {
  return preguntasFaltantes(seccion, respuestas).length === 0;
}

export function dimensionesCompletadas(secciones: readonly Seccion[], respuestas: Respuestas): number {
  return secciones.filter((seccion) => seccion.dimension !== null && seccionCompleta(seccion, respuestas)).length;
}

// La opción exclusiva ("Ninguna") reemplaza a las demás, y elegir otra la retira.
export function normalizarSeleccion(anterior: readonly string[], nueva: readonly string[], exclusiva: string): readonly string[] {
  const agregoExclusiva = nueva.includes(exclusiva) && !anterior.includes(exclusiva);
  if (agregoExclusiva) return [exclusiva];
  return nueva.filter((opcion) => opcion !== exclusiva || nueva.length === 1);
}

export function registrarRespuesta(respuestas: Respuestas, pregunta: Pregunta, valor: ValorRespuesta): Respuestas {
  if (pregunta.tipo !== 'multiple' || valor.tipo !== 'opciones') return new Map(respuestas).set(pregunta.id, valor);
  const anterior = respuestas.get(pregunta.id);
  const previas = anterior?.tipo === 'opciones' ? anterior.opciones : [];
  const opciones = normalizarSeleccion(previas, valor.opciones, pregunta.exclusiva);
  return new Map(respuestas).set(pregunta.id, { tipo: 'opciones', opciones });
}

// Solo viaja lo que la persona ve y respondió; los textos van sin espacios sobrantes.
export function respuestasParaEnvio(secciones: readonly Seccion[], respuestas: Respuestas): Respuestas {
  const envio = new Map<string, ValorRespuesta>();
  for (const pregunta of secciones.flatMap((seccion) => seccion.preguntas)) {
    const valor = respuestas.get(pregunta.id);
    if (valor === undefined || !estaRespondida(valor) || !esVisible(pregunta, respuestas)) continue;
    envio.set(pregunta.id, valor.tipo === 'texto' ? { tipo: 'texto', texto: valor.texto.trim() } : valor);
  }
  return envio;
}
