import { useEffect, useState } from 'react';
import { haySesionValida, ingresarPanel, type ResultadoIngreso } from '../../data/sesion-panel';
import { irA, RUTAS_PANEL } from './rutas-panel';

export type ErrorIngreso = Exclude<ResultadoIngreso, 'ingreso'>;

export function useIngreso() {
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<ErrorIngreso | null>(null);

  // Con una sesión vigente, el login lleva directo al panel.
  useEffect(() => {
    void haySesionValida().then((valida) => { if (valida) irA(RUTAS_PANEL.panel); });
  }, []);

  const ingresar = async (usuario: string, clave: string) => {
    if (pendiente) return;
    setPendiente(true);
    setError(null);
    const resultado = await ingresarPanel(usuario, clave);
    setPendiente(false);
    if (resultado === 'ingreso') irA(RUTAS_PANEL.panel);
    else setError(resultado);
  };

  return { pendiente, error, ingresar: (usuario: string, clave: string) => { void ingresar(usuario, clave); } };
}
