// Edad a la fecha de hoy a partir de una fecha "AAAA-MM-DD"
function calculateAge(dateText) {
  const birth = new Date(dateText + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
