import { useState } from 'react';
import { verificarCedula } from '../data/encuesta-rpc';
import { leerCedula } from '../domain/cedula';
import type { ErrorAcceso, ResultadoAcceso } from '../domain/resultados';

export type EstadoAcceso =
  | { readonly tipo: 'identificando' }
  | { readonly tipo: 'habilitado'; readonly cedula: number }
  | { readonly tipo: 'ya-respondio' };

const ERRORES: Record<ResultadoAcceso['tipo'], ErrorAcceso | null> = {
  habilitado: null,
  'ya-respondio': null,
  'no-habilitado': 'no-habilitado',
  error: 'conexion',
};

export function useAcceso() {
  const [estado, setEstado] = useState<EstadoAcceso>({ tipo: 'identificando' });
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<ErrorAcceso | null>(null);

  const ingresar = async (texto: string) => {
    // Enter en el formulario envía aunque el botón esté pendiente.
    if (pendiente) return;
    const cedula = leerCedula(texto);
    if (cedula === null) { setError('cedula-invalida'); return; }
    setPendiente(true);
    setError(null);
    const resultado = await verificarCedula(cedula);
    setPendiente(false);
    setError(ERRORES[resultado.tipo]);
    if (resultado.tipo === 'habilitado') setEstado({ tipo: 'habilitado', cedula });
    if (resultado.tipo === 'ya-respondio') setEstado({ tipo: 'ya-respondio' });
  };

  return { estado, pendiente, error, ingresar: (texto: string) => { void ingresar(texto); } };
}
