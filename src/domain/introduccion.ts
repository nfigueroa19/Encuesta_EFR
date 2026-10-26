export type ElementoIntroduccion =
  | { readonly tipo: 'parrafo'; readonly texto: string }
  | { readonly tipo: 'lista'; readonly items: readonly string[] };

export interface BloqueIntroduccion {
  // null en el cierre, que continúa el apartado anterior sin título propio.
  readonly titulo: string | null;
  readonly elementos: readonly ElementoIntroduccion[];
}

export interface ContenidoIntroduccion {
  readonly titulo: string;
  readonly bloques: readonly BloqueIntroduccion[];
  readonly confirmacion: string;
}

const parrafo = (texto: string): ElementoIntroduccion => ({ tipo: 'parrafo', texto });
const lista = (...items: readonly string[]): ElementoIntroduccion => ({ tipo: 'lista', items });

// Texto confirmado por el HSLV el 2026-10-25. No se edita por estética.
// Nombre completo del hospital, nunca la sigla (indicación del HSLV).
export const INTRODUCCION: ContenidoIntroduccion = {
  titulo: 'Diagnóstico EFR 2026',
  bloques: [
    {
      titulo: '¿Qué es una Entidad Familiarmente Responsable?',
      elementos: [
        parrafo('Es una organización que pone en marcha acciones para mejorar la calidad de vida de sus colaboradores y de sus familias, sin perder competitividad. En el modelo efr solo cuentan las acciones voluntarias que van más allá de lo que exige la ley.'),
        parrafo('Estas acciones se gestionan con objetivos, responsables e indicadores, y se revisan en un ciclo de mejora continua (planear, hacer, verificar, actuar). No son una lista de beneficios sueltos.'),
        lista(
          'Salud y riesgos psicosociales',
          'Cuidado de la familia y de personas dependientes',
          'Ocio, cultura y deporte',
          'Formación y desarrollo profesional',
        ),
      ],
    },
    {
      titulo: '¿Para qué es esta encuesta?',
      elementos: [
        parrafo('El Hospital Susana López de Valencia está construyendo su línea base EFR 2026. Su opinión permite saber cómo estamos en seis dimensiones:'),
        lista(
          'Calidad en el empleo',
          'Apoyo a la familia y conciliación',
          'Flexibilidad temporal y espacial',
          'Desarrollo personal y profesional',
          'Igualdad de oportunidades, diversidad e inclusión',
          'Liderazgo y cultura EFR',
        ),
      ],
    },
    {
      titulo: null,
      elementos: [
        parrafo('La encuesta está dirigida al personal de planta del hospital. Su cédula se usa para verificar que usted está en el registro de personal y que cada persona responda una sola vez.'),
        parrafo('No hay respuestas correctas o incorrectas. Responda según su experiencia.'),
      ],
    },
  ],
  confirmacion: 'He leído y comprendido los lineamientos',
};
