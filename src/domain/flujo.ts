// Máquina de estados del cuestionario (flujo-encuesta-efr), una vez validada la cédula:
// introducción → secciones del Instrumento A → decisión de líder → (Instrumento B) → envío.
export type Paso =
  | { readonly tipo: 'introduccion' }
  | { readonly tipo: 'seccion'; readonly indice: number }
  | { readonly tipo: 'decision-lider' }
  | { readonly tipo: 'lideres' }
  | { readonly tipo: 'enviado' }
  | { readonly tipo: 'ya-respondio' };

export type Evento =
  | { readonly tipo: 'lectura-confirmada' }
  | { readonly tipo: 'siguiente' }
  | { readonly tipo: 'anterior' }
  | { readonly tipo: 'continuar-como-lider' }
  | { readonly tipo: 'envio-registrado' }
  | { readonly tipo: 'ya-respondio' };

export const PASO_INICIAL: Paso = { tipo: 'introduccion' };

function siguiente(paso: Paso, totalSecciones: number): Paso {
  if (paso.tipo !== 'seccion') return paso;
  const proxima = paso.indice + 1;
  return proxima < totalSecciones ? { tipo: 'seccion', indice: proxima } : { tipo: 'decision-lider' };
}

function anterior(paso: Paso, totalSecciones: number): Paso {
  switch (paso.tipo) {
    case 'seccion':
      return paso.indice > 0 ? { tipo: 'seccion', indice: paso.indice - 1 } : { tipo: 'introduccion' };
    case 'decision-lider':
      return { tipo: 'seccion', indice: totalSecciones - 1 };
    case 'lideres':
      return { tipo: 'decision-lider' };
    default:
      return paso;
  }
}

const enviable = (paso: Paso) => paso.tipo === 'decision-lider' || paso.tipo === 'lideres';

// Un evento que no corresponde al paso actual no cambia nada.
export function transicion(paso: Paso, evento: Evento, totalSecciones: number): Paso {
  switch (evento.tipo) {
    case 'lectura-confirmada':
      return paso.tipo === 'introduccion' ? { tipo: 'seccion', indice: 0 } : paso;
    case 'siguiente':
      return siguiente(paso, totalSecciones);
    case 'anterior':
      return anterior(paso, totalSecciones);
    case 'continuar-como-lider':
      return paso.tipo === 'decision-lider' ? { tipo: 'lideres' } : paso;
    case 'envio-registrado':
      return enviable(paso) ? { tipo: 'enviado' } : paso;
    case 'ya-respondio':
      return enviable(paso) ? { tipo: 'ya-respondio' } : paso;
  }
}
