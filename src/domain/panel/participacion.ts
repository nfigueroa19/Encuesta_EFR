import type { Envio } from './datos-panel';

export interface ResumenParticipacion {
  readonly respondieron: number;
  readonly habilitados: number;
  readonly porcentaje: number;
  readonly hoy: number;
  readonly lideres: number;
}

// `hoy` llega como YYYY-MM-DD en hora de Colombia, el mismo formato de enviado_el.
export function resumenParticipacion(envios: readonly Envio[], habilitados: number, hoy: string): ResumenParticipacion {
  return {
    respondieron: envios.length,
    habilitados,
    porcentaje: habilitados === 0 ? 0 : (envios.length / habilitados) * 100,
    hoy: envios.filter((envio) => envio.enviadoEl === hoy).length,
    lideres: envios.filter((envio) => envio.respondioLideres).length,
  };
}

// Un nombre que empiece por = + - @ se ejecutaría como fórmula al abrir el CSV en Excel.
function celdaCsv(valor: string): string {
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replaceAll('"', '""')}"`;
}

// Punto y coma: Excel en español (Colombia) lo usa como separador de listas.
export function csvEnvios(envios: readonly Envio[]): string {
  const filas = envios.map((envio) =>
    [String(envio.cedula), envio.nombre ?? '', envio.respondioLideres ? 'Sí' : 'No', envio.enviadoEl].map(celdaCsv).join(';'),
  );
  return ['Cédula;Nombre;Líder;Fecha de envío', ...filas].join('\r\n');
}
