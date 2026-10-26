import type { Seccion } from './cuestionario';

// Texto literal del Instrumento B, hasta el marcador "FIN LIDERES". El documento no numera las preguntas.
const PREGUNTAS_LIDERES: readonly string[] = [
  '¿Por qué considera importante para el HSLV implementar el modelo EFR?',
  '¿Qué beneficios estratégicos espera obtener con la implementación del modelo?',
  '¿Cuáles considera que son actualmente las principales fortalezas del HSLV en materia de conciliación?',
  '¿Cuáles considera que son las principales brechas?',
  '¿Qué medidas de conciliación considera que deberían fortalecerse?',
  '¿Qué medidas considera viables para el personal asistencial?',
  '¿Qué medidas considera viables para el personal administrativo?',
  '¿Qué barreras podrían dificultar la utilización de las medidas EFR?',
  '¿Considera que los líderes facilitan realmente el uso de las medidas de conciliación? ¿Por qué?',
  '¿Qué comportamientos de liderazgo deberían modificarse?',
  '¿Qué medidas podrían implementarse sin afectar la continuidad y seguridad de la atención?',
  '¿Cómo debería incorporarse EFR a la estrategia institucional?',
  '¿Qué indicadores deberían utilizarse para evaluar los resultados?',
  '¿Qué recursos considera necesarios para implementar el modelo? ¿Qué compromiso concreto está dispuesto a asumir como líder para fortalecer la cultura EFR?',
];

export const SECCION_LIDERES: Seccion = {
  id: 'lideres',
  titulo: 'Voz de líderes y dirección',
  indicacion: 'Respuestas opcionales. No escriba nombres de otras personas ni datos que permitan identificarlas.',
  dimension: null,
  preguntas: PREGUNTAS_LIDERES.map((enunciado, indice) => ({
    tipo: 'texto-largo',
    id: `B-${String(indice + 1).padStart(2, '0')}`,
    numero: null,
    enunciado,
  })),
};
