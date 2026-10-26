import { useEffect, useState } from 'react';
import { conTransicionDeVista } from '../ui/movimiento/transicion-vista';
import { guardarPreferencia, leerPreferencia } from './preferencia-local';
import { esPreferenciaTema, resolverTema, type PreferenciaTema } from './tema';

const CLAVE_TEMA = 'efr-hslv:tema';
const CONSULTA_OSCURO = '(prefers-color-scheme: dark)';

export function leerPreferenciaTema(): PreferenciaTema {
  return leerPreferencia(CLAVE_TEMA, esPreferenciaTema, 'sistema');
}

export function aplicarTema(preferencia: PreferenciaTema): void {
  const sistemaOscuro = window.matchMedia(CONSULTA_OSCURO).matches;
  document.documentElement.dataset.theme = resolverTema(preferencia, sistemaOscuro);
}

export function useTema() {
  const [preferencia, setPreferencia] = useState(leerPreferenciaTema);

  useEffect(() => {
    guardarPreferencia(CLAVE_TEMA, preferencia);
    if (preferencia !== 'sistema') return undefined;
    const consulta = window.matchMedia(CONSULTA_OSCURO);
    const alCambiarSistema = () => { aplicarTema('sistema'); };
    consulta.addEventListener('change', alCambiarSistema);
    return () => { consulta.removeEventListener('change', alCambiarSistema); };
  }, [preferencia]);

  // El atributo cambia dentro de la transición para que el navegador capture el antes y el después.
  const cambiarPreferencia = (nueva: PreferenciaTema) => {
    conTransicionDeVista(() => {
      aplicarTema(nueva);
      setPreferencia(nueva);
    });
  };

  return { preferencia, cambiarPreferencia };
}
