export interface BloqueIntroduccion {
  readonly titulo: string;
  readonly parrafos: readonly string[];
  readonly lista: readonly string[];
}

export interface ContenidoIntroduccion {
  readonly aprobado: boolean;
  readonly titulo: string;
  readonly bloques: readonly BloqueIntroduccion[];
  readonly confirmacion: string;
}

// Borrador de introduccion-modelo-efr, pendiente de aprobación de Talento Humano.
// Resumen en redacción propia de la norma efr 1000-0 (Fundación Másfamilia, derechos reservados:
// no se copia texto literal). No se edita por estética: el texto final lo entrega el HSLV.
export const INTRODUCCION: ContenidoIntroduccion = {
  aprobado: false,
  titulo: 'Diagnóstico EFR HSLV 2026',
  bloques: [
    {
      titulo: '¿Qué es una Entidad Familiarmente Responsable?',
      parrafos: [
        'Es una organización que pone en marcha acciones para mejorar la calidad de vida de sus colaboradores y de sus familias, sin perder competitividad. En el modelo efr solo cuentan las acciones voluntarias que van más allá de lo que exige la ley.',
        'Estas acciones se gestionan con objetivos, responsables e indicadores, y se revisan en un ciclo de mejora continua (planear, hacer, verificar, actuar). No son una lista de beneficios sueltos.',
      ],
      lista: [
        'Salud y riesgos psicosociales',
        'Cuidado de la familia y de personas dependientes',
        'Ocio, cultura y deporte',
        'Formación y desarrollo profesional',
      ],
    },
    {
      titulo: '¿Para qué es esta encuesta?',
      parrafos: [
        'El HSLV está construyendo su línea base EFR 2026. Su opinión permite saber cómo estamos en seis dimensiones:',
      ],
      lista: [
        'Calidad en el empleo',
        'Apoyo a la familia y conciliación',
        'Flexibilidad temporal y espacial',
        'Desarrollo personal y profesional',
        'Igualdad de oportunidades, diversidad e inclusión',
        'Liderazgo y cultura EFR',
      ],
    },
    {
      titulo: '¿Cómo se usan sus respuestas?',
      parrafos: [
        'La encuesta está dirigida al personal de planta del hospital. Su cédula se usa para verificar que usted está en el registro de personal y que cada persona responda una sola vez.',
        'Los resultados se analizan de forma agregada. El aviso de tratamiento de datos personales del HSLV está pendiente de publicación.',
      ],
      lista: [],
    },
    {
      titulo: 'Antes de empezar',
      parrafos: [
        'No hay respuestas correctas o incorrectas. Responda según su experiencia.',
        'Primero encontrará datos de caracterización, luego 48 afirmaciones en seis dimensiones y al final preguntas abiertas opcionales. Si usted es líder, podrá responder unas preguntas adicionales antes de enviar.',
      ],
      lista: [],
    },
  ],
  confirmacion: 'He leído y comprendido los lineamientos',
};
