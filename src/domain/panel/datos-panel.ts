// Datos que entregan las funciones efr_panel_* (migración 20261113120000), ya validados en data/.

export interface Envio {
  readonly cedula: number;
  // null si la cédula ya no está en `personal` (otros aplicativos recargan esa tabla).
  readonly nombre: string | null;
  readonly respondioLideres: boolean;
  // AN-03: solo el día, YYYY-MM-DD en hora de Colombia.
  readonly enviadoEl: string;
}

export interface ConteoOpcion {
  readonly preguntaId: string;
  readonly opcion: string;
  readonly total: number;
  // Personas que contestaron la pregunta: denominador de los porcentajes, también en selección múltiple.
  readonly respondientes: number;
}

export interface TextoAbierto {
  readonly preguntaId: string;
  readonly texto: string;
}

export interface DatosPanel {
  readonly envios: readonly Envio[];
  readonly habilitados: number;
  readonly conteos: readonly ConteoOpcion[];
  readonly textos: readonly TextoAbierto[];
}
