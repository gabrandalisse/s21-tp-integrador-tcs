// RN7: el DNI debe tener 7 u 8 dígitos numéricos, sin puntos ni espacios.
// Función pura: no toca el DOM ni el estado, por eso se puede probar con Jest.
export function esDniValido(dni) {
  if (typeof dni !== 'string' && typeof dni !== 'number') {
    return false;
  }
  return /^\d{7,8}$/.test(String(dni));
}
