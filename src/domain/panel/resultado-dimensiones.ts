import type { Seccion } from '../cuestionario';
import type { ConteoOpcion } from './datos-panel';
import { nivelSemaforo, porcentajeDimension, promedioLikert, type NivelSemaforo } from './puntaje-efr';

export interface ResultadoDimension {
  readonly dimension: number;
  readonly titulo: string;
  // null mientras ningún ítem de la dimensión tenga respuestas.
  readonly porcentaje: number | null;
  readonly nivel: NivelSemaforo | null;
}

export function resultadoDimensiones(secciones: readonly Seccion[], conteos: readonly ConteoOpcion[]): readonly ResultadoDimension[] {
  return secciones.flatMap((seccion) => {
    if (seccion.dimension === null) return [];
    const ids = seccion.preguntas.filter((pregunta) => pregunta.tipo === 'likert').map((pregunta) => pregunta.id);
    const promedio = promedioLikert(conteos, ids);
    const porcentaje = promedio === null ? null : porcentajeDimension(promedio);
    return [{ dimension: seccion.dimension, titulo: seccion.titulo, porcentaje, nivel: porcentaje === null ? null : nivelSemaforo(porcentaje) }];
  });
}
