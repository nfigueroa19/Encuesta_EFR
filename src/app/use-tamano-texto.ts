import { useEffect, useState } from 'react';
import { guardarPreferencia, leerPreferencia } from './preferencia-local';
import { esTamanoTexto, type TamanoTexto } from './tamano-texto';

const CLAVE_TAMANO = 'efr-hslv:tamano-texto';

export function leerTamanoTexto(): TamanoTexto {
  return leerPreferencia(CLAVE_TAMANO, esTamanoTexto, 'normal');
}

// styles/index.css traduce el atributo en el tamaño raíz; todo el texto y los espacios están en rem.
export function aplicarTamanoTexto(tamano: TamanoTexto): void {
  document.documentElement.dataset.tamanoTexto = tamano;
}

export function useTamanoTexto() {
  const [tamano, setTamano] = useState(leerTamanoTexto);

  useEffect(() => {
    aplicarTamanoTexto(tamano);
    guardarPreferencia(CLAVE_TAMANO, tamano);
  }, [tamano]);

  return { tamano, cambiarTamano: setTamano };
}
