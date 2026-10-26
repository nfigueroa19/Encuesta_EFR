import { Alert, Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { useState, type SyntheticEvent } from 'react';
import type { ErrorAcceso } from '../../domain/resultados';
import { LogoBienvenida } from '../logo-bienvenida';
import { MarcoPaso } from '../marco-paso';
import { SIN_AUTOCOMPLETADO } from '../sin-autocompletado';

const MENSAJES_CAMPO = {
  'cedula-invalida': 'Escriba solo los números de su cédula, entre 5 y 11 dígitos.',
  'no-habilitado': 'No encontramos esta cédula en el registro de personal. Revise el número o comuníquese con Talento Humano.',
} as const;

interface PropsPantallaAcceso {
  readonly pendiente: boolean;
  readonly error: ErrorAcceso | null;
  readonly onIngresar: (cedula: string) => void;
}

export function PantallaAcceso({ pendiente, error, onIngresar }: PropsPantallaAcceso) {
  const [cedula, setCedula] = useState('');
  const alEnviar = (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    onIngresar(cedula);
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
        <Button type="submit" isPending={pendiente} fullWidth>Ingresar</Button>
        {error === 'conexion' ? <AvisoConexion /> : null}
      </form>
    </MarcoPaso>
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
