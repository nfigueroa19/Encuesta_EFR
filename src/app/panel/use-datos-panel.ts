import { useCallback, useEffect, useState } from 'react';
import { cargarDatosPanel } from '../../data/panel-rpc';
import { haySesionValida } from '../../data/sesion-panel';
import { escucharEnvios } from '../../data/tiempo-real-panel';
import type { DatosPanel } from '../../domain/panel/datos-panel';
import { irA, RUTAS_PANEL } from './rutas-panel';
import { salirDelPanel } from './salir-panel';

export type EstadoPanel =
  | { readonly tipo: 'cargando' }
  | { readonly tipo: 'datos'; readonly datos: DatosPanel }
  | { readonly tipo: 'error'; readonly detalle: string };

// Respaldo si el canal en vivo se cae: una consulta cada minuto.
const RESPALDO_MS = 60_000;

function useCargaPanel() {
  const [estado, setEstado] = useState<EstadoPanel>({ tipo: 'cargando' });
  const recargar = useCallback(async () => {
    const resultado = await cargarDatosPanel();
    if (resultado.tipo === 'sin-permiso') { await salirDelPanel(); return; }
    if (resultado.tipo === 'error') setEstado({ tipo: 'error', detalle: resultado.detalle });
    else setEstado({ tipo: 'datos', datos: resultado.datos });
  }, []);
  return { estado, recargar };
}

export function useDatosPanel() {
  const { estado, recargar } = useCargaPanel();

  useEffect(() => {
    let detener: () => void = () => undefined;
    let activo = true;
    void haySesionValida().then((valida) => {
      if (!valida) { irA(RUTAS_PANEL.ingreso); return; }
      if (!activo) return;
      void recargar();
      const dejarDeEscuchar = escucharEnvios(() => { void recargar(); });
      const respaldo = window.setInterval(() => { void recargar(); }, RESPALDO_MS);
      detener = () => { dejarDeEscuchar(); window.clearInterval(respaldo); };
    });
    return () => { activo = false; detener(); };
  }, [recargar]);

  return { estado, recargar: () => { void recargar(); } };
}
