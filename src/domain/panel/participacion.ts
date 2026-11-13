import type { Envio } from './datos-panel';

// Personal de planta según Talento Humano (dato del usuario, 2026-11-13). La tabla `personal` tiene
// 115 cédulas con entidad HSLV porque está desactualizada; por eso el total no se calcula de ella.
export const PERSONAL_PLANTA = 99;

export interface ResumenParticipacion {
  readonly respondieron: number;
  readonly total: number;
  readonly porcentaje: number;
  readonly hoy: number;
  readonly lideres: number;
}

// `hoy` llega como YYYY-MM-DD en hora de Colombia, el mismo formato de enviado_el.
export function resumenParticipacion(envios: readonly Envio[], hoy: string): ResumenParticipacion {
  return {
    respondieron: envios.length,
    total: PERSONAL_PLANTA,
    porcentaje: (envios.length / PERSONAL_PLANTA) * 100,
    hoy: envios.filter((envio) => envio.enviadoEl === hoy).length,
    lideres: envios.filter((envio) => envio.respondioLideres).length,
  };
}

// Sin tildes ni mayúsculas: "Gomez" encuentra "Gómez".
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

// Busca por nombre o por cédula. En la cédula se ignoran puntos y espacios ("1.061.234" = "1061234").
export function filtrarEnvios(envios: readonly Envio[], busqueda: string): readonly Envio[] {
  const texto = normalizar(busqueda);
  if (texto === '') return envios;
  const digitos = texto.replace(/[\s.]/g, '');
  return envios.filter((envio) =>
    (/^\d+$/.test(digitos) && String(envio.cedula).includes(digitos)) || normalizar(envio.nombre ?? '').includes(texto),
  );
}
