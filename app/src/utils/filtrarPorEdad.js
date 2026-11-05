// RF2: filtro de actividades por edad. Funciones puras, probadas con Jest.

// Indica si una edad está dentro del rango de la actividad (bordes incluidos).
export function esAptaParaEdad(actividad, edad) {
  return edad >= actividad.edadMinima && edad <= actividad.edadMaxima;
}

// Convierte lo que escribe el usuario en una edad válida (1 a 99) o null si no sirve.
export function interpretarEdad(texto) {
  if (texto === null || texto === undefined || String(texto).trim() === '') return null;
  if (!/^\d{1,2}$/.test(String(texto).trim())) return null;
  const edad = Number(texto);
  return edad >= 1 && edad <= 99 ? edad : null;
}

// Devuelve solo las actividades aptas para la edad. Sin edad válida, devuelve todas.
export function filtrarPorEdad(actividades, edad) {
  if (!Array.isArray(actividades)) return [];
  if (edad === null || edad === undefined || Number.isNaN(edad)) return actividades;
  return actividades.filter((actividad) => esAptaParaEdad(actividad, edad));
}
