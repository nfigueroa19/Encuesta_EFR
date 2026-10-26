import { useEffect, useState } from 'react';
import { sondearTablaPersonal } from '../data/sonda-personal';
import type { EstadoConexion } from '../domain/estado-conexion';

export function useSondaPersonal() {
  const [estado, setEstado] = useState<EstadoConexion>({ tipo: 'verificando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Descarta respuestas de intentos anteriores y el doble montaje de StrictMode.
    let vigente = true;
    void sondearTablaPersonal().then((resultado) => {
      if (vigente) setEstado(resultado);
    });
    return () => { vigente = false; };
  }, [intento]);

  const verificar = () => {
    setEstado({ tipo: 'verificando' });
    setIntento((anterior) => anterior + 1);
  };

  return { estado, verificar };
}
