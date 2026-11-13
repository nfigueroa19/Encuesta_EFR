import type { ConteoOpcion } from './datos-panel';

// Resultado PRELIMINAR (aprobado como tal por el usuario el 2026-11-13): solo la voz del colaborador,
// sin la ponderación 70/20/10 ni el Instrumento C (ponderacion-semaforo-linea-base, vacío 9).
// Escala 1 a 5 propuesta: el documento no fija la conversión de la Likert (vacío 2).
const PUNTOS_LIKERT: ReadonlyMap<string, number> = new Map([
  ['totalmente-de-acuerdo', 5],
  ['de-acuerdo', 4],
  ['parcialmente-de-acuerdo', 3],
  ['en-desacuerdo', 2],
  ['totalmente-en-desacuerdo', 1],
]);

export type NivelSemaforo = 'critico' | 'bajo' | 'en-desarrollo' | 'consolidado' | 'avanzado';

// Límites inferiores del documento. Entre rangos (39,5 %) gana el inferior: pregunta abierta en la nota.
const NIVELES: readonly (readonly [number, NivelSemaforo])[] = [
  [90, 'avanzado'],
  [75, 'consolidado'],
  [60, 'en-desarrollo'],
  [40, 'bajo'],
  [0, 'critico'],
];

// Promedio sobre 5 de las respuestas a los ítems dados; null si nadie respondió.
export function promedioLikert(conteos: readonly ConteoOpcion[], preguntaIds: readonly string[]): number | null {
  let puntos = 0;
  let respuestas = 0;
  for (const conteo of conteos) {
    const valor = PUNTOS_LIKERT.get(conteo.opcion);
    if (valor === undefined || !preguntaIds.includes(conteo.preguntaId)) continue;
    puntos += valor * conteo.total;
    respuestas += conteo.total;
  }
  return respuestas === 0 ? null : puntos / respuestas;
}

// Ejemplo del documento: 3,75 / 5 × 100 = 75 %.
export function porcentajeDimension(promedio: number): number {
  return (promedio / 5) * 100;
}

export function nivelSemaforo(porcentaje: number): NivelSemaforo {
  return NIVELES.find(([minimo]) => porcentaje >= minimo)?.[1] ?? 'critico';
}
