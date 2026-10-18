class Activity {
  constructor(
    name,
    discipline,
    days,
    time,
    minAge,
    maxAge,
    capacity,
    monthlyFee,
    teacher,
  ) {
    this.name = name;
    this.discipline = discipline;
    this.days = days;
    this.time = time;
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.capacity = capacity;
    this.monthlyFee = monthlyFee;
    this.teacher = teacher;
  }

  // true si la edad está dentro del rango de la actividad
  isSuitableForAge(age) {
    return age >= this.minAge && age <= this.maxAge;
  }

  // Ej: "6 a 12 años"
  getAgeRange() {
    return `${this.minAge} a ${this.maxAge} años`;
  }

  // Ej: "$ 18.000"
  getFormattedFee() {
    return this.monthlyFee.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  }
}

// Arreglo de objetos con las actividades del club
const activities = [
  new Activity(
    "Fútbol infantil",
    "Fútbol",
    "Lun y Mié",
    "18:00",
    6,
    12,
    40,
    18000,
    "Diego Ferreyra",
  ),
  new Activity(
    "Vóley mixto",
    "Vóley",
    "Mar y Jue",
    "19:00",
    13,
    60,
    24,
    20000,
    "Laura Ceballos",
  ),
  new Activity(
    "Básquet juvenil",
    "Básquet",
    "Lun y Vie",
    "19:30",
    12,
    17,
    20,
    19000,
    "Martín Oviedo",
  ),
  new Activity(
    "Natación",
    "Natación",
    "Mar y Jue",
    "17:00",
    5,
    70,
    30,
    26000,
    "Sofía Bustos",
  ),
  new Activity(
    "Patín artístico",
    "Patín",
    "Mié y Vie",
    "17:30",
    5,
    15,
    25,
    21000,
    "Carla Peralta",
  ),
  new Activity(
    "Ajedrez",
    "Ajedrez",
    "Sáb",
    "10:00",
    8,
    99,
    16,
    9000,
    "Raúl Giménez",
  ),
  new Activity(
    "Funcional adultos",
    "Fitness",
    "Lun, Mié y Vie",
    "20:30",
    18,
    65,
    30,
    22000,
    "Paula Luna",
  ),
  new Activity(
    "Yoga",
    "Bienestar",
    "Mar y Jue",
    "9:00",
    16,
    99,
    15,
    17000,
    "Inés Arguello",
  ),
];

// Busca una actividad por su nombre
function findActivity(name) {
  return activities.find((activity) => activity.name === name);
}

// Lista de disciplinas sin repetir
function getDisciplines() {
  return [...new Set(activities.map((activity) => activity.discipline))];
}

// Filtra por disciplina ('' = todas) y por edad (NaN = cualquiera)
function filterActivities(discipline, age) {
  return activities.filter((activity) => {
    const matchesDiscipline =
      discipline === "" || activity.discipline === discipline;
    const matchesAge = isNaN(age) || activity.isSuitableForAge(age);
    return matchesDiscipline && matchesAge;
  });
}
