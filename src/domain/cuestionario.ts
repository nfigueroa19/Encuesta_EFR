// Modelo del cuestionario. Los id coinciden con public.efr_preguntas (migración 20261024230000).
export interface Opcion {
  readonly id: string;
  readonly texto: string;
}

export interface CondicionVisibilidad {
  readonly pregunta: string;
  readonly opcion: string;
}

export type Pregunta =
  | { readonly tipo: 'likert'; readonly id: string; readonly numero: number; readonly enunciado: string }
  | { readonly tipo: 'unica'; readonly id: string; readonly enunciado: string; readonly opciones: readonly Opcion[] }
  | {
      readonly tipo: 'multiple';
      readonly id: string;
      readonly enunciado: string;
      readonly opciones: readonly Opcion[];
      readonly exclusiva: string;
    }
  | { readonly tipo: 'texto-corto'; readonly id: string; readonly enunciado: string; readonly visibleSi: CondicionVisibilidad | null }
  | { readonly tipo: 'texto-largo'; readonly id: string; readonly numero: number | null; readonly enunciado: string };

export interface Seccion {
  readonly id: string;
  readonly titulo: string;
  readonly indicacion: string;
  // Número de dimensión (1 a 6) para el progreso por hojas; null en secciones sin puntaje.
  readonly dimension: number | null;
  readonly preguntas: readonly Pregunta[];
}

export const LIMITE_TEXTO = { 'texto-corto': 80, 'texto-largo': 2000 } as const;

// Las preguntas cerradas son obligatorias; las de texto, opcionales (igual que en la base de datos).
export function esObligatoria(pregunta: Pregunta): boolean {
  return pregunta.tipo === 'likert' || pregunta.tipo === 'unica' || pregunta.tipo === 'multiple';
}
