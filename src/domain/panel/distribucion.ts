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

// Barra divergente (Heiberger y Robbins, 2014): el centro de la opción neutra queda en el centro del eje.
// El eje va de 100 % en desacuerdo (izquierda) a 100 % de acuerdo (derecha), así que la barra completa
// ocupa la mitad del ancho. Recibe las opciones de desacuerdo a acuerdo y devuelve dónde empieza la barra,
// en porcentaje del ancho del eje.
export function inicioBarraDivergente(desacuerdoAAcuerdo: readonly PorcentajeOpcion[]): number {
  const mitad = Math.floor(desacuerdoAAcuerdo.length / 2);
  const negativos = desacuerdoAAcuerdo.slice(0, mitad).reduce((suma, item) => suma + item.porcentaje, 0);
  const neutro = desacuerdoAAcuerdo[mitad]?.porcentaje ?? 0;
  return 50 - (negativos + neutro / 2) / 2;
}
