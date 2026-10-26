import type { Pregunta, Seccion } from './cuestionario';

// Texto literal de "Intrumentos EFR.docx", desde el inicio hasta antes de "INSTRUMENTO B".
// Los ítems 9 a 15 de la Dimensión 1 quedan fuera (vacío 1 de fuente-instrumentos-efr-hslv).

const CARACTERIZACION: readonly Pregunta[] = [
  { tipo: 'unica', id: 'A-C-01', enunciado: 'Área o proceso', opciones: [
    { id: 'asistencial', texto: 'Asistencial' }, { id: 'administrativo', texto: 'Administrativo' },
    { id: 'apoyo', texto: 'Apoyo' }, { id: 'otro', texto: 'Otro' },
  ] },
  { tipo: 'unica', id: 'A-C-02', enunciado: 'Tipo de jornada', opciones: [
    { id: 'diurna', texto: 'Diurna' }, { id: 'turnos', texto: 'Turnos' },
    { id: 'mixta', texto: 'Mixta' }, { id: 'otra', texto: 'Otra' },
  ] },
  { tipo: 'unica', id: 'A-C-03', enunciado: 'Antigüedad', opciones: [
    { id: 'menos-de-1', texto: 'Menos de 1 año' }, { id: '1-a-3', texto: '1–3 años' },
    { id: '4-a-6', texto: '4–6 años' }, { id: '7-a-10', texto: '7–10 años' }, { id: 'mas-de-10', texto: 'Más de 10 años' },
  ] },
  { tipo: 'unica', id: 'A-C-04', enunciado: 'Nivel del cargo', opciones: [
    { id: 'directivo', texto: 'Directivo' }, { id: 'profesional', texto: 'Profesional' },
    { id: 'tecnico', texto: 'Técnico' }, { id: 'asistencial', texto: 'Asistencial' },
    { id: 'administrativo-otro', texto: 'Administrativo/otro' },
  ] },
  { tipo: 'multiple', id: 'A-C-05', enunciado: '¿Tiene actualmente responsabilidades de cuidado?', exclusiva: 'ninguna', opciones: [
    { id: 'hijos-menores', texto: 'Hijos menores' }, { id: 'hijos-mayores-dependientes', texto: 'Hijos mayores dependientes' },
    { id: 'adultos-mayores', texto: 'Adultos mayores' }, { id: 'familiar-necesidad-cuidado', texto: 'Familiar con necesidad de cuidado' },
    { id: 'ninguna', texto: 'Ninguna' }, { id: 'otra', texto: 'Otra' },
  ] },
  { tipo: 'unica', id: 'A-C-06', enunciado: '¿Tiene personas que dependan económicamente de usted?', opciones: [
    { id: 'si', texto: 'Sí' }, { id: 'no', texto: 'No' },
  ] },
  { tipo: 'texto-corto', id: 'A-C-07', enunciado: '¿Cuál es tu género?', visibleSi: null },
  { tipo: 'texto-corto', id: 'A-C-08', enunciado: '¿En qué rango de edad te encuentras?', visibleSi: null },
  { tipo: 'texto-corto', id: 'A-C-09', enunciado: '¿Cuál es tu estado civil?', visibleSi: null },
  { tipo: 'texto-corto', id: 'A-C-10', enunciado: '¿Cuál es el parentesco de las personas que dependen económicamente de ti?',
    visibleSi: { pregunta: 'A-C-06', opcion: 'si' } },
];

const DIMENSIONES: readonly (readonly [string, readonly string[]])[] = [
  ['Calidad en el empleo', [
    'Considero que las condiciones laborales del HSLV favorecen mi bienestar integral.',
    'La organización de mi trabajo me permite cumplir adecuadamente mis responsabilidades laborales sin afectar innecesariamente mi vida personal.',
    'En mi área se respetan los tiempos de descanso establecidos.',
    'La distribución de las cargas de trabajo permite desarrollar las funciones de manera sostenible.',
    'Cuando las necesidades del servicio generan una mayor carga laboral, mi jefe procura buscar alternativas para evitar una afectación prolongada en mi vida personal.',
    'En mi área se respetan los tiempos destinados para alimentación y descanso, de acuerdo con las condiciones de la jornada.',
    'Considero que el HSLV se preocupa por mejorar las condiciones que afectan la calidad de vida de sus colaboradores.',
    'Puedo expresar ante mi jefe situaciones personales o familiares que puedan afectar temporalmente mi desempeño laboral sin temor a consecuencias negativas.',
  ]],
  ['Apoyo a la familia y conciliación', [
    'El HSLV facilita la conciliación entre mis responsabilidades laborales, personales y familiares.',
    'Las medidas institucionales tienen en cuenta las diferentes realidades familiares de los colaboradores.',
    'Cuando tengo una situación familiar importante, encuentro comprensión por parte de mi jefe inmediato.',
    'La institución facilita, dentro de sus posibilidades y de acuerdo con las necesidades del servicio, alternativas para atender situaciones familiares.',
    'Los beneficios de bienestar del HSLV incluyen actividades o medidas que favorecen también a las familias de los colaboradores.',
    'Considero que el HSLV reconoce que las responsabilidades familiares no son iguales para todas las personas.',
    'Las actividades institucionales de bienestar tienen en cuenta la participación de las familias.',
    'Las decisiones relacionadas con mi trabajo consideran razonablemente el impacto que pueden tener sobre mi vida familiar.',
  ]],
  ['Flexibilidad temporal y espacial', [
    'En mi área existe apertura para analizar alternativas de organización del tiempo de trabajo cuando se presenta una necesidad personal o familiar.',
    'Cuando es posible por la naturaleza del cargo, se consideran alternativas de flexibilidad horaria.',
    'Los cambios de turno o de jornada, cuando son procedentes, pueden gestionarse mediante mecanismos claros.',
    'En mi área existe una adecuada planificación de los turnos que permite organizar razonablemente la vida personal y familiar.',
    'La programación de turnos considera, cuando es posible y procedente, situaciones personales o familiares debidamente justificadas.',
    'Cuando una medida de flexibilidad no puede aplicarse por razones del servicio, mi jefe explica claramente las razones.',
    'El HSLV utiliza alternativas de flexibilidad laboral cuando la naturaleza del cargo y las condiciones institucionales lo permiten.',
    'Considero que existe equilibrio entre las necesidades de continuidad del servicio y las necesidades personales y familiares de los colaboradores.',
  ]],
  ['Desarrollo personal y profesional', [
    'El HSLV ofrece oportunidades de formación que contribuyen tanto a mi desarrollo profesional como personal.',
    'Las actividades de capacitación tienen en cuenta las necesidades reales de los colaboradores.',
    'La participación en actividades de formación procura considerar las condiciones de jornada y disponibilidad del personal.',
    'Las responsabilidades familiares no constituyen una barrera para acceder a oportunidades de desarrollo profesional.',
    'Considero que puedo desarrollar mi proyecto profesional dentro del HSLV sin tener que sacrificar completamente mi vida personal o familiar.',
    'Los líderes promueven el desarrollo profesional de sus colaboradores respetando sus circunstancias personales.',
    'El HSLV reconoce y aprovecha las capacidades, conocimientos y talentos de sus colaboradores.',
    'Las oportunidades de crecimiento y desarrollo se comunican de manera clara y oportuna.',
  ]],
  ['Igualdad de oportunidades, diversidad e inclusión', [
    'En el HSLV existen condiciones de igualdad para acceder a oportunidades de desarrollo.',
    'Las responsabilidades familiares no generan discriminación en el entorno laboral.',
    'Las personas que utilizan permisos o medidas de conciliación no son percibidas como menos comprometidas con la institución.',
    'En mi área se respetan las diferentes formas de organización familiar.',
    'Las oportunidades laborales y de desarrollo se asignan con criterios objetivos y transparentes.',
    'El HSLV promueve el respeto por la diversidad de sus colaboradores.',
    'Los colaboradores pueden expresar necesidades personales o familiares sin temor a ser discriminados.',
    'Considero que existe una cultura institucional que favorece la corresponsabilidad entre hombres y mujeres frente a las responsabilidades familiares.',
  ]],
  ['Liderazgo y cultura EFR', [
    'Mi jefe inmediato demuestra con sus actuaciones que reconoce la importancia del equilibrio entre vida laboral, personal y familiar.',
    'Mi jefe facilita que utilice los beneficios o medidas institucionales a los que tengo derecho.',
    'Utilizar una medida de conciliación no afecta negativamente la percepción que mi jefe tiene sobre mi compromiso laboral.',
    'Mi jefe evita promover una cultura en la que sea normal trabajar permanentemente fuera de la jornada.',
    'En mi equipo se respeta el tiempo personal y familiar de los colaboradores.',
    'Los líderes del HSLV son coherentes entre lo que dicen sobre bienestar y conciliación y sus propias actuaciones.',
    'Los líderes promueven un ambiente basado en confianza, respeto y corresponsabilidad.',
    'Considero que el HSLV está construyendo una verdadera cultura de Entidad Familiarmente Responsable.',
  ]],
];

const ABIERTAS: readonly string[] = [
  '¿Qué es lo que actualmente hace mejor el HSLV para facilitar el equilibrio entre la vida laboral, personal y familiar?',
  '¿Cuál considera que es la principal dificultad que actualmente afecta su equilibrio entre trabajo, vida personal y familia?',
  '¿Qué medida o beneficio considera que debería implementar o fortalecer el HSLV?',
  '¿Qué debería cambiar en el liderazgo de los equipos para favorecer una cultura de conciliación?',
  '¿Qué medida sería especialmente importante para los colaboradores que trabajan por turnos?',
  '¿Qué medida considera que debería beneficiar también a las familias de los colaboradores?',
  'Si pudiera cambiar una sola cosa para mejorar su calidad de vida laboral en el HSLV, ¿cuál sería?',
  '¿Qué significa para usted que el HSLV sea una Entidad Familiarmente Responsable?',
];

const ITEMS_POR_DIMENSION = 8;
const PRIMERA_ABIERTA = 53;
const dosDigitos = (n: number) => String(n).padStart(2, '0');

function seccionDimension([nombre, enunciados]: readonly [string, readonly string[]], indice: number): Seccion {
  const dimension = indice + 1;
  return {
    id: `D${String(dimension)}`,
    titulo: `Dimensión ${String(dimension)}. ${nombre}`,
    indicacion: 'Indique qué tan de acuerdo está con cada afirmación.',
    dimension,
    preguntas: enunciados.map((enunciado, posicion) => {
      const numero = indice * ITEMS_POR_DIMENSION + posicion + 1;
      return { tipo: 'likert', id: `A-D${String(dimension)}-${dosDigitos(numero)}`, numero, enunciado };
    }),
  };
}

export const SECCIONES_INSTRUMENTO_A: readonly Seccion[] = [
  {
    id: 'caracterizacion',
    titulo: 'Datos de caracterización',
    indicacion: 'Estos datos no generan puntaje y se analizan únicamente de manera agregada.',
    dimension: null,
    preguntas: CARACTERIZACION,
  },
  ...DIMENSIONES.map(seccionDimension),
  {
    id: 'abiertas',
    titulo: 'Preguntas abiertas',
    indicacion: 'Respuestas opcionales. No escriba nombres de otras personas ni datos que permitan identificarlas.',
    dimension: null,
    preguntas: ABIERTAS.map((enunciado, posicion) => {
      const numero = PRIMERA_ABIERTA + posicion;
      return { tipo: 'texto-largo', id: `A-AB-${String(numero)}`, numero, enunciado };
    }),
  },
];
