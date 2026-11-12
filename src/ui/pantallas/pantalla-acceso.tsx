import { Alert, Button, Checkbox, FieldError, Input, Label, TextField } from '@heroui/react';
import { useState, type SyntheticEvent } from 'react';
import type { ErrorAcceso } from '../../domain/resultados';
import { LogoBienvenida } from '../logo-bienvenida';
import { MarcoPaso } from '../marco-paso';
import { SIN_AUTOCOMPLETADO } from '../sin-autocompletado';

const MENSAJES_CAMPO = {
  'cedula-invalida': 'Escriba solo los números de su cédula, entre 5 y 11 dígitos.',
  'no-habilitado': 'No encontramos esta cédula en el registro de personal. Revise el número o comuníquese con Talento Humano.',
} as const;

const URL_POLITICA_DATOS = 'https://hosusana.gov.co/Transparencia/PoliticasLineamientos/Pol%C3%ADtica%20tratamiento%20de%20datos.pdf';

interface PropsPantallaAcceso {
  readonly pendiente: boolean;
  readonly error: ErrorAcceso | null;
  readonly onIngresar: (cedula: string) => void;
}

export function PantallaAcceso({ pendiente, error, onIngresar }: PropsPantallaAcceso) {
  const [cedula, setCedula] = useState('');
  const [autorizado, setAutorizado] = useState(false);
  const alEnviar = (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (autorizado) onIngresar(cedula);
  };
  const errorCampo = error === 'conexion' ? null : error;
  return (
    <MarcoPaso titulo="Diagnóstico EFR 2026" antetitulo={null} ilustracion={<LogoBienvenida />}>
      <p className="mx-auto max-w-[60ch] text-center">
        Encuesta para el personal de planta del Hospital Susana López de Valencia. Ingrese su número de cédula para comenzar.
      </p>
      <form onSubmit={alEnviar} noValidate {...SIN_AUTOCOMPLETADO} className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <TextField value={cedula} onChange={setCedula} isInvalid={errorCampo !== null} fullWidth>
          <Label>Número de cédula</Label>
          <Input inputMode="numeric" maxLength={15} {...SIN_AUTOCOMPLETADO} />
          <FieldError>{errorCampo === null ? null : MENSAJES_CAMPO[errorCampo]}</FieldError>
        </TextField>
        <AvisoDatos autorizado={autorizado} onCambiar={setAutorizado} />
        <Button type="submit" isPending={pendiente} isDisabled={!autorizado} fullWidth>Ingresar</Button>
        {error === 'conexion' ? <AvisoConexion /> : null}
      </form>
    </MarcoPaso>
  );
}

interface PropsAvisoDatos {
  readonly autorizado: boolean;
  readonly onCambiar: (autorizado: boolean) => void;
}

function AvisoDatos({ autorizado, onCambiar }: PropsAvisoDatos) {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox isSelected={autorizado} onChange={onCambiar} className="opcion-respuesta">
        <Checkbox.Content>
          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
          <span>Autorizo el tratamiento de mis datos personales</span>
        </Checkbox.Content>
      </Checkbox>
      <TextoAvisoDatos />
    </div>
  );
}

function TextoAvisoDatos() {
  return (
    <p className="text-body-sm text-muted">
      Autorizo al Hospital Susana López de Valencia E.S.E. a tratar mis datos personales con las finalidades de verificar mi
      identidad y registrar mis respuestas en el diagnóstico EFR 2026, de conformidad con la Ley 1581 de 2012 y con la{' '}
      <a href={URL_POLITICA_DATOS} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2">
        Política de tratamiento de datos personales
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
      .
    </p>
  );
}

function AvisoConexion() {
  return (
    <Alert status="danger" className="animate-entrada">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>No pudimos conectar con el servidor</Alert.Title>
        <Alert.Description>Revise su conexión a internet e intente de nuevo.</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
