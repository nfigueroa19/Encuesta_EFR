import { describe, expect, it } from 'vitest';
import { leerCedula } from './cedula';

describe('leerCedula', () => {
  it('acepta dígitos con puntos o espacios como separadores', () => {
    expect(leerCedula('1061234567')).toBe(1061234567);
    expect(leerCedula('1.061.234.567')).toBe(1061234567);
    expect(leerCedula(' 34 567 890 ')).toBe(34567890);
  });

  it('rechaza letras, signos, ceros iniciales y longitudes fuera de rango', () => {
    for (const texto of ['', 'abc', '12-34567', '1234', '123456789012', '0123456', '1e10', '../1234567']) {
      expect(leerCedula(texto)).toBeNull();
    }
  });
});
