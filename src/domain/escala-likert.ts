import type { Opcion } from './cuestionario';

// Escala listada en el documento fuente bajo el ítem 1; aplica a los 48 ítems (confirmado por el usuario el 2026-10-24).
export const ESCALA_LIKERT: readonly Opcion[] = [
  { id: 'totalmente-de-acuerdo', texto: 'Totalmente de acuerdo' },
  { id: 'de-acuerdo', texto: 'De acuerdo' },
  { id: 'parcialmente-de-acuerdo', texto: 'Parcialmente de acuerdo' },
  { id: 'en-desacuerdo', texto: 'En desacuerdo' },
  { id: 'totalmente-en-desacuerdo', texto: 'Totalmente en desacuerdo' },
];
