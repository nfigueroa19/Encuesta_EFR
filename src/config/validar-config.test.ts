import { describe, expect, it } from 'vitest';
import { validarConfigPublica } from './validar-config';

const URL_VALIDA = 'https://ejemplo.supabase.co';
const CLAVE_VALIDA = 'sb_publishable_abc';

describe('validarConfigPublica', () => {
  it('acepta una URL https y una clave publicable', () => {
    expect(validarConfigPublica(URL_VALIDA, CLAVE_VALIDA)).toEqual({ url: URL_VALIDA, clave: CLAVE_VALIDA });
  });

  it('detiene el build si falta alguna variable', () => {
    expect(() => validarConfigPublica(undefined, CLAVE_VALIDA)).toThrow(/Faltan/);
    expect(() => validarConfigPublica(URL_VALIDA, undefined)).toThrow(/Faltan/);
  });

  it('rechaza destinos sin HTTPS o mal formados', () => {
    expect(() => validarConfigPublica('http://ejemplo.supabase.co', CLAVE_VALIDA)).toThrow(/https/);
    expect(() => validarConfigPublica('', CLAVE_VALIDA)).toThrow(/https/);
  });

  it('rechaza la clave secreta sin mostrar su valor', () => {
    const secreta = 'sb_secret_no_debe_aparecer';
    expect(() => validarConfigPublica(URL_VALIDA, secreta)).toThrow(/sb_publishable_/);
    expect(() => validarConfigPublica(URL_VALIDA, secreta)).not.toThrow(new RegExp(secreta));
  });
});
