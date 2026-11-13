import { clientePanel } from './cliente-panel';

// Canal privado 'efr-panel' (migración 20261113120000): la carga llega vacía, solo avisa que hubo un envío.
// Si el canal no conecta, el panel sigue con la consulta de respaldo de cada minuto (use-datos-panel).
export function escucharEnvios(alRecibir: () => void): () => void {
  const canal = clientePanel.channel('efr-panel', { config: { private: true } });
  canal.on('broadcast', { event: 'nuevo_envio' }, alRecibir);
  void clientePanel.realtime.setAuth().then(() => {
    canal.subscribe();
  });
  return () => {
    void clientePanel.removeChannel(canal);
  };
}
