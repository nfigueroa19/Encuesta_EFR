import type { Paso } from '../domain/flujo';
import { SECCIONES_INSTRUMENTO_A } from '../domain/instrumento-a';
import { PantallaSeccion } from '../ui/pantallas/pantalla-seccion';
import type { ControlEncuesta } from './use-encuesta';
import type { ControlEnvio } from './use-envio';

const TOTAL_SECCIONES = SECCIONES_INSTRUMENTO_A.length;

function antetituloDe(paso: Paso): string {
  return paso.tipo === 'seccion' ? `Sección ${String(paso.indice + 1)} de ${String(TOTAL_SECCIONES)}` : 'Preguntas para líderes';
}

function textoAccionDe(paso: Paso): string {
  if (paso.tipo === 'lideres') return 'Enviar encuesta';
  return paso.tipo === 'seccion' && paso.indice === TOTAL_SECCIONES - 1 ? 'Continuar' : 'Siguiente sección';
}

// Secciones del Instrumento A y del B. En el B, la acción principal envía la encuesta.
export function PantallaCuestionario({ encuesta, envio }: { readonly encuesta: ControlEncuesta; readonly envio: ControlEnvio }) {
  const { paso, seccion, emitir } = encuesta;
  // PasoActual solo monta esta pantalla en los pasos 'seccion' y 'lideres', que siempre tienen sección.
  if (seccion === null) return null;
  const esLideres = paso.tipo === 'lideres';
  const avanzar = () => {
    if (!encuesta.validar()) return;
    if (esLideres) envio.enviar(true);
    else emitir({ tipo: 'siguiente' });
  };
  return (
    <PantallaSeccion
      seccion={seccion}
      antetitulo={antetituloDe(paso)}
      preguntas={encuesta.preguntas}
      respuestas={encuesta.respuestas}
      faltantes={encuesta.faltantes}
      intentos={encuesta.intentos}
      accion={{ texto: textoAccionDe(paso), pendiente: esLideres && envio.pendiente }}
      errorEnvio={esLideres ? envio.error : null}
      onResponder={encuesta.responder}
      onAnterior={() => { emitir({ tipo: 'anterior' }); }}
      onSiguiente={avanzar}
    />
  );
}
