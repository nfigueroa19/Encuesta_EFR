import { Alert, Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { useState, type SyntheticEvent } from 'react';
import { LogoBienvenida } from '../logo-bienvenida';
import { MarcoPaso } from '../marco-paso';

export type ErrorIngresoVista = 'credenciales' | 'conexion';

interface PropsPantallaIngreso {
  readonly pendiente: boolean;
  readonly error: ErrorIngresoVista | null;
  readonly onIngresar: (usuario: string, clave: string) => void;
}

export function PantallaIngreso({ pendiente, error, onIngresar }: PropsPantallaIngreso) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const alEnviar = (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    onIngresar(usuario, clave);
  };
  return (
    <MarcoPaso titulo="Panel de resultados EFR" antetitulo={null} ilustracion={<LogoBienvenida />}>
      <p className="mx-auto max-w-[60ch] text-center">Acceso exclusivo de Talento Humano.</p>
      <form onSubmit={alEnviar} noValidate className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <TextField value={usuario} onChange={setUsuario} isInvalid={error === 'credenciales'} fullWidth>
          <Label>Usuario</Label>
          <Input autoComplete="username" autoCapitalize="none" spellCheck={false} />
        </TextField>
        <TextField value={clave} onChange={setClave} isInvalid={error === 'credenciales'} fullWidth>
          <Label>Contraseña</Label>
          <Input type="password" autoComplete="current-password" />
          <FieldError>{error === 'credenciales' ? 'Usuario o contraseña incorrectos.' : null}</FieldError>
        </TextField>
        <Button type="submit" isPending={pendiente} fullWidth>Ingresar</Button>
        {error === 'conexion' ? <AvisoSinConexion /> : null}
      </form>
    </MarcoPaso>
  );
}

function AvisoSinConexion() {
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
