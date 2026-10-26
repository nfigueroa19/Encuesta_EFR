import type { ReactNode } from 'react';
import { TOTAL_DIMENSIONES } from '../domain/dimensiones';
import { clavePaso, type Paso } from '../domain/flujo';
import { SECCIONES_INSTRUMENTO_A } from '../domain/instrumento-a';
import { INTRODUCCION } from '../domain/introduccion';
import { dimensionesCompletadas, hayRespuestas, type Respuestas } from '../domain/respuestas';
import { DisenoPagina } from '../ui/diseno-pagina';
import type { Progreso } from '../ui/encabezado';
import { PantallaCierre } from '../ui/pantallas/pantalla-cierre';
import { PantallaDecisionLider } from '../ui/pantallas/pantalla-decision-lider';
import { PantallaIntroduccion } from '../ui/pantallas/pantalla-introduccion';
import { PantallaCuestionario } from './pantalla-cuestionario';
import { useAvisoSalida } from './use-aviso-salida';
import { useHistorialPasos } from './use-historial-pasos';
import { useEncuesta, type ControlEncuesta } from './use-encuesta';
import { useEnvio, type ControlEnvio } from './use-envio';

interface PropsEncuesta {
  readonly cedula: number;
  readonly apariencia: ReactNode;
  readonly pie: ReactNode;
}


function progresoDe(paso: Paso, respuestas: Respuestas): Progreso | null {
  if (paso.tipo !== 'seccion' && paso.tipo !== 'decision-lider' && paso.tipo !== 'lideres') return null;
  return { completadas: dimensionesCompletadas(SECCIONES_INSTRUMENTO_A, respuestas), total: TOTAL_DIMENSIONES };
}

// Solo existe con una cédula validada: el envío nunca queda sin titular.
export function Encuesta({ cedula, apariencia, pie }: PropsEncuesta) {
  const encuesta = useEncuesta();
  useHistorialPasos(encuesta.paso, SECCIONES_INSTRUMENTO_A.length, encuesta.irAPaso);
  const envio = useEnvio(cedula, encuesta.respuestas, encuesta.emitir);
  const cerrado = encuesta.paso.tipo === 'enviado' || encuesta.paso.tipo === 'ya-respondio';
  useAvisoSalida(!cerrado && hayRespuestas(encuesta.respuestas));
  return (
    <DisenoPagina progreso={progresoDe(encuesta.paso, encuesta.respuestas)} apariencia={apariencia} pie={pie}>
      <PasoActual key={clavePaso(encuesta.paso)} encuesta={encuesta} envio={envio} />
    </DisenoPagina>
  );
}

interface PropsPasoActual {
  readonly encuesta: ControlEncuesta;
  readonly envio: ControlEnvio;
}

function PasoActual({ encuesta, envio }: PropsPasoActual) {
  const { paso, emitir } = encuesta;
  switch (paso.tipo) {
    case 'introduccion':
      return <PantallaIntroduccion contenido={INTRODUCCION} onConfirmar={() => { emitir({ tipo: 'lectura-confirmada' }); }} />;
    case 'seccion':
    case 'lideres':
      return <PantallaCuestionario encuesta={encuesta} envio={envio} />;
    case 'decision-lider':
      return (
        <PantallaDecisionLider
          pendiente={envio.pendiente}
          errorEnvio={envio.error}
          onAnterior={() => { emitir({ tipo: 'anterior' }); }}
          onEnviar={() => { envio.enviar(false); }}
          onContinuarComoLider={() => { emitir({ tipo: 'continuar-como-lider' }); }}
        />
      );
    case 'enviado':
    case 'ya-respondio':
      return <PantallaCierre motivo={paso.tipo} />;
  }
}
