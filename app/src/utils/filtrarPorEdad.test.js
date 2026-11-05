import { esAptaParaEdad, filtrarPorEdad, interpretarEdad } from './filtrarPorEdad';

const futbol = { nombre: 'Fútbol infantil', edadMinima: 6, edadMaxima: 12 };
const voley = { nombre: 'Vóley mixto', edadMinima: 13, edadMaxima: 60 };
const natacion = { nombre: 'Natación', edadMinima: 5, edadMaxima: 70 };
const todas = [futbol, voley, natacion];

describe('filtro por edad (RF2)', () => {
  test('incluye los bordes del rango', () => {
    expect(esAptaParaEdad(futbol, 6)).toBe(true);
    expect(esAptaParaEdad(futbol, 12)).toBe(true);
    expect(esAptaParaEdad(futbol, 13)).toBe(false);
  });

  test('con 10 años muestra fútbol y natación', () => {
    expect(filtrarPorEdad(todas, 10).map((a) => a.nombre)).toEqual(['Fútbol infantil', 'Natación']);
  });

  test('con 22 años muestra vóley y natación', () => {
    expect(filtrarPorEdad(todas, 22).map((a) => a.nombre)).toEqual(['Vóley mixto', 'Natación']);
  });

  test('sin edad devuelve todas las actividades', () => {
    expect(filtrarPorEdad(todas, null)).toHaveLength(3);
  });

  test('interpreta solo edades válidas de 1 a 99', () => {
    expect(interpretarEdad('14')).toBe(14);
    expect(interpretarEdad('')).toBeNull();
    expect(interpretarEdad('0')).toBeNull();
    expect(interpretarEdad('100')).toBeNull();
    expect(interpretarEdad('1a')).toBeNull();
  });
});
