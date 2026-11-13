import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { clientePanel } from './cliente-panel';

export type EstadoTiempoReal = 'conectando' | 'en-vivo' | 'sin-conexion';

// Canal privado 'efr-panel' (migración 20261113120000): la carga llega vacía, solo avisa que hubo un envío.
export function escucharEnvios(alRecibir: () => void, alCambiarEstado: (estado: EstadoTiempoReal) => void): () => void {
  const canal = clientePanel.channel('efr-panel', { config: { private: true } });
  canal.on('broadcast', { event: 'nuevo_envio' }, alRecibir);
  void clientePanel.realtime.setAuth().then(() => {
    canal.subscribe((estado) => {
      alCambiarEstado(estado === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'en-vivo' : 'sin-conexion');
    });
  });
  return () => {
    void clientePanel.removeChannel(canal);
  };
}
