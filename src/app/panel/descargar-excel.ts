import { strToU8, zipSync } from 'fflate';
import type { Envio } from '../../domain/panel/datos-panel';
import { partesLibroEnvios } from '../../domain/panel/excel-envios';
import { hoyEnColombia } from './rutas-panel';

const TIPO_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Se arma en el navegador: la lista no pasa por ningún servidor.
export function descargarExcelEnvios(envios: readonly Envio[]): void {
  const partes = Object.fromEntries(Object.entries(partesLibroEnvios(envios)).map(([ruta, xml]) => [ruta, strToU8(xml)]));
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(new Blob([zipSync(partes)], { type: TIPO_XLSX }));
  enlace.download = `envios-efr-${hoyEnColombia()}.xlsx`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}
