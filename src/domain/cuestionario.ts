// Modelo del cuestionario. Los id coinciden con public.efr_preguntas (migraciones 20261024230000 y 20261025120000).
export interface Opcion {
  readonly id: string;
  readonly texto: string;
}

// La pregunta se muestra solo si la respuesta de `pregunta` es (o incluye, en selección múltiple) `opcion`.
export interface CondicionVisibilidad {
  readonly pregunta: string;
  readonly opcion: string;
}

export type Pregunta =
  | { readonly tipo: 'likert'; readonly id: string; readonly numero: number; readonly enunciado: string }
  | {
      readonly tipo: 'unica';
      readonly id: string;
      readonly enunciado: string;
      readonly opciones: readonly Opcion[];
      readonly visibleSi?: CondicionVisibilidad;
    }
  | {
      readonly tipo: 'multiple';
      readonly id: string;
      readonly enunciado: string;
      readonly opciones: readonly Opcion[];
      // Opción que excluye a las demás; si ninguna opción lo es, un id que no esté en la lista.
      readonly exclusiva: string;
      readonly visibleSi?: CondicionVisibilidad;
    }
  | { readonly tipo: 'texto-corto'; readonly id: string; readonly enunciado: string; readonly visibleSi: CondicionVisibilidad | null }
  | { readonly tipo: 'texto-largo'; readonly id: string; readonly numero: number | null; readonly enunciado: string };

export interface Seccion {
  readonly id: string;
  readonly titulo: string;
  readonly indicacion: string | null;
  // Número de dimensión (1 a 6) para el progreso por hojas; null en secciones sin puntaje.
  readonly dimension: number | null;
  readonly preguntas: readonly Pregunta[];
}

export const LIMITE_TEXTO = { 'texto-corto': 80, 'texto-largo': 2000 } as const;

// Mínimo de caracteres (sin espacios sobrantes) para dar por respondida una pregunta de texto.
// Debe coincidir con efr_valor_valido (migración 20261025180000).
export const MINIMO_TEXTO = { 'texto-corto': 2, 'texto-largo': 10 } as const;
