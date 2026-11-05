// RN6: la cuota mensual estimada es la suma de las cuotas de las actividades
// activas, con 10 % de descuento si tiene 2 actividades y 15 % si tiene 3.

// Devuelve el porcentaje de bonificación según la cantidad de actividades.
export function obtenerPorcentajeDescuento(cantidadActividades) {
  if (cantidadActividades >= 3) return 15;
  if (cantidadActividades === 2) return 10;
  return 0;
}

// Recibe un arreglo de actividades con la propiedad cuotaMensual
// y devuelve el total a pagar (número redondeado a 2 decimales).
export function calcularCuotaMensual(actividades) {
  if (!Array.isArray(actividades) || actividades.length === 0) {
    return 0;
  }
  const subtotal = actividades.reduce(
    (suma, actividad) => suma + Number(actividad.cuotaMensual || 0),
    0
  );
  const porcentaje = obtenerPorcentajeDescuento(actividades.length);
  const total = subtotal - (subtotal * porcentaje) / 100;
  return Math.round(total * 100) / 100;
}

// Formatea un número como pesos argentinos: 18000 -> "$ 18.000"
export function formatearPesos(monto) {
  return '$ ' + Number(monto).toLocaleString('es-AR', { maximumFractionDigits: 2 });
}
