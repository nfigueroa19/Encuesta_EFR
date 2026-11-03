import { Alert, Button } from '@heroui/react';
import type { Pregunta, Seccion } from '../../domain/cuestionario';
import type { Respuestas, ValorRespuesta } from '../../domain/respuestas';
import { MarcoPaso } from '../marco-paso';
import { CampoPregunta } from '../preguntas/campo-pregunta';
import { ResumenFaltantes } from '../resumen-faltantes';

export interface AccionPrincipal {
  readonly texto: string;
  readonly pendiente: boolean;
}

interface PropsPantallaSeccion {
  readonly seccion: Seccion;
  readonly antetitulo: string;
  // Solo las preguntas visibles según las respuestas actuales.
  readonly preguntas: readonly Pregunta[];
  readonly respuestas: Respuestas;
  // Vacío hasta que la persona intenta avanzar con preguntas obligatorias sin responder.
  readonly faltantes: readonly Pregunta[];
  readonly intentos: number;
  readonly accion: AccionPrincipal;
  readonly errorEnvio: string | null;
  readonly onResponder: (pregunta: Pregunta, valor: ValorRespuesta) => void;
  readonly onAnterior: () => void;
  readonly onSiguiente: () => void;
}

export function PantallaSeccion(props: PropsPantallaSeccion) {
  const { seccion, preguntas, respuestas, faltantes, onResponder } = props;
  const idsFaltantes = new Set(faltantes.map((pregunta) => pregunta.id));
  return (
    <MarcoPaso titulo={seccion.titulo} antetitulo={props.antetitulo} ilustracion={null}>
      {seccion.indicacion === null ? null : <p className="max-w-[75ch] text-muted">{seccion.indicacion}</p>}
      <ResumenFaltantes key={props.intentos} faltantes={faltantes} />
      <div className="rejilla-preguntas">
        {preguntas.map((pregunta) => (
          <CampoPregunta
            key={pregunta.id}
            pregunta={pregunta}
            valor={respuestas.get(pregunta.id)}
            invalida={idsFaltantes.has(pregunta.id)}
            onResponder={onResponder}
          />
        ))}
      </div>
      <Navegacion accion={props.accion} errorEnvio={props.errorEnvio} onAnterior={props.onAnterior} onSiguiente={props.onSiguiente} />
    </MarcoPaso>
  );
}

type PropsNavegacion = Pick<PropsPantallaSeccion, 'accion' | 'errorEnvio' | 'onAnterior' | 'onSiguiente'>;

function Navegacion({ accion, errorEnvio, onAnterior, onSiguiente }: PropsNavegacion) {
  return (
    <div className="flex flex-col gap-4">
      {errorEnvio === null ? null : <AvisoEnvio detalle={errorEnvio} />}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onPress={onAnterior} isDisabled={accion.pendiente}>Anterior</Button>
        <Button onPress={onSiguiente} isPending={accion.pendiente}>{accion.texto}</Button>
      </div>
    </div>
  );
}

export function AvisoEnvio({ detalle }: { readonly detalle: string }) {
  return (
    <Alert status="danger" className="animate-entrada">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>No se pudo enviar la encuesta</Alert.Title>
        <Alert.Description>{detalle}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
