// Edad a la fecha de hoy a partir de una fecha "AAAA-MM-DD" (como la devuelve la API).
export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  const nacimiento = new Date(fechaNacimiento + 'T00:00:00');
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMeses = hoy.getMonth() - nacimiento.getMonth();
  if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
