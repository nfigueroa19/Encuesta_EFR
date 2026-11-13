import type { Opcion } from '../cuestionario';
import type { ConteoOpcion } from './datos-panel';

export interface PorcentajeOpcion {
  readonly opcion: Opcion;
  readonly total: number;
  // 0 a 100. En selección múltiple los porcentajes de una pregunta pueden sumar más de 100.
  readonly porcentaje: number;
}

export interface Distribucion {
  readonly respondientes: number;
  readonly opciones: readonly PorcentajeOpcion[];
}

// Conserva el orden del catálogo y deja en 0 las opciones que nadie eligió.
export function distribucion(conteos: readonly ConteoOpcion[], preguntaId: string, opciones: readonly Opcion[]): Distribucion {
  const propios = conteos.filter((conteo) => conteo.preguntaId === preguntaId);
  const respondientes = propios[0]?.respondientes ?? 0;
  return {
    respondientes,
    opciones: opciones.map((opcion) => {
      const total = propios.find((conteo) => conteo.opcion === opcion.id)?.total ?? 0;
      return { opcion, total, porcentaje: respondientes === 0 ? 0 : (total / respondientes) * 100 };
    }),
  };
}
