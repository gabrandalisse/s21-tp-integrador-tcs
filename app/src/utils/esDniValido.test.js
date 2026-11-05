import { esDniValido } from './esDniValido';

describe('esDniValido (RN7)', () => {
  test('acepta un DNI de 8 dígitos', () => {
    expect(esDniValido('40123456')).toBe(true);
  });

  test('acepta un DNI de 7 dígitos', () => {
    expect(esDniValido('7123456')).toBe(true);
  });

  test('rechaza un DNI con puntos', () => {
    expect(esDniValido('40.123.456')).toBe(false);
  });

  test('rechaza un DNI con letras', () => {
    expect(esDniValido('40A23456')).toBe(false);
  });

  test('rechaza un DNI de 6 dígitos', () => {
    expect(esDniValido('123456')).toBe(false);
  });

  test('rechaza un DNI de 9 dígitos', () => {
    expect(esDniValido('123456789')).toBe(false);
  });

  test('rechaza vacío, espacios y valores que no son texto', () => {
    expect(esDniValido('')).toBe(false);
    expect(esDniValido(' 40123456 ')).toBe(false);
    expect(esDniValido(null)).toBe(false);
    expect(esDniValido(undefined)).toBe(false);
  });
});
