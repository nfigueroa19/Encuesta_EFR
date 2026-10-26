import { useEffect, useState } from 'react';
import { esPreferenciaTema, resolverTema, type PreferenciaTema } from './tema';

// Clave fija, nunca derivada de la entrada del usuario (LFI-01).
const CLAVE_TEMA = 'efr-hslv:tema';
const CONSULTA_OSCURO = '(prefers-color-scheme: dark)';

export function leerPreferenciaTema(): PreferenciaTema {
  try {
    const guardada = localStorage.getItem(CLAVE_TEMA);
    return esPreferenciaTema(guardada) ? guardada : 'sistema';
  } catch {
    return 'sistema';
  }
}

function guardarPreferenciaTema(preferencia: PreferenciaTema): void {
  try {
    localStorage.setItem(CLAVE_TEMA, preferencia);
  } catch {
    // Almacenamiento bloqueado (modo privado, política del equipo): la elección dura esta visita.
  }
}

export function aplicarTema(preferencia: PreferenciaTema): void {
  const sistemaOscuro = window.matchMedia(CONSULTA_OSCURO).matches;
  document.documentElement.dataset.theme = resolverTema(preferencia, sistemaOscuro);
}

export function useTema() {
  const [preferencia, setPreferencia] = useState(leerPreferenciaTema);

  useEffect(() => {
    aplicarTema(preferencia);
    guardarPreferenciaTema(preferencia);
    if (preferencia !== 'sistema') return undefined;
    const consulta = window.matchMedia(CONSULTA_OSCURO);
    const alCambiarSistema = () => { aplicarTema('sistema'); };
    consulta.addEventListener('change', alCambiarSistema);
    return () => { consulta.removeEventListener('change', alCambiarSistema); };
  }, [preferencia]);

  return { preferencia, cambiarPreferencia: setPreferencia };
}
