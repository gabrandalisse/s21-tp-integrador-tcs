import { calcularCuotaMensual, obtenerPorcentajeDescuento } from './calcularCuotaMensual';

const futbol = { nombre: 'Fútbol infantil', cuotaMensual: 18000 };
const voley = { nombre: 'Vóley mixto', cuotaMensual: 20000 };
const ajedrez = { nombre: 'Ajedrez', cuotaMensual: 9000 };

describe('calcularCuotaMensual (RN6)', () => {
  test('con 0 actividades la cuota es 0', () => {
    expect(calcularCuotaMensual([])).toBe(0);
  });

  test('con 1 actividad no hay descuento', () => {
    expect(calcularCuotaMensual([futbol])).toBe(18000);
  });

  test('con 2 actividades aplica 10 % de descuento', () => {
    // (18000 + 20000) * 0.90 = 34200
    expect(calcularCuotaMensual([futbol, voley])).toBe(34200);
  });

  test('con 3 actividades aplica 15 % de descuento', () => {
    // (18000 + 20000 + 9000) * 0.85 = 39950
    expect(calcularCuotaMensual([futbol, voley, ajedrez])).toBe(39950);
  });

  test('si no recibe un arreglo devuelve 0', () => {
    expect(calcularCuotaMensual(undefined)).toBe(0);
    expect(calcularCuotaMensual(null)).toBe(0);
  });

  test('acepta cuotas que llegan como texto desde la API', () => {
    expect(calcularCuotaMensual([{ cuotaMensual: '10000' }, { cuotaMensual: '10000' }])).toBe(18000);
  });
});

describe('obtenerPorcentajeDescuento', () => {
  test('devuelve 0, 0, 10 y 15 según la cantidad', () => {
    expect(obtenerPorcentajeDescuento(0)).toBe(0);
    expect(obtenerPorcentajeDescuento(1)).toBe(0);
    expect(obtenerPorcentajeDescuento(2)).toBe(10);
    expect(obtenerPorcentajeDescuento(3)).toBe(15);
  });
});
