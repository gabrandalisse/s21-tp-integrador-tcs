const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DNI_REGEX = /^\d{7,8}$/; // RN7: 7 u 8 dígitos, sin puntos
const PHONE_REGEX = /^[\d\s+()-]{8,}$/;

// Reglas por campo (la clave es el id del input).
// Cada una devuelve el mensaje de error o '' si el valor es válido.
const signupValidators = {
  firstName: (value) => (value === '' ? 'Ingresá tu nombre.' : ''),
  lastName: (value) => (value === '' ? 'Ingresá tu apellido.' : ''),
  dni: (value) => {
    if (value === '') return 'Ingresá tu DNI.';
    if (!DNI_REGEX.test(value)) return 'El DNI debe tener 7 u 8 números, sin puntos.';
    return '';
  },
  birthDate: (value) => {
    if (value === '') return 'Ingresá tu fecha de nacimiento.';
    const age = calculateAge(value);
    if (isNaN(age) || age < 0) return 'La fecha no es válida.';
    return '';
  },
  email: (value) => {
    if (value === '') return 'Ingresá tu email.';
    if (!EMAIL_REGEX.test(value)) return 'El email no tiene un formato válido.';
    return '';
  },
  phone: (value) => {
    if (value === '') return 'Ingresá un teléfono de contacto.';
    if (!PHONE_REGEX.test(value)) return 'El teléfono no parece válido.';
    return '';
  },
  activity: (value) => {
    if (value === '') return 'Elegí una actividad.';
    // Usa el método de la clase Activity para controlar la edad
    const activity = findActivity(value);
    const birthDate = document.getElementById('birthDate').value;
    if (birthDate && !activity.isSuitableForAge(calculateAge(birthDate))) {
      return `Esta actividad es para personas de ${activity.getAgeRange()}.`;
    }
    return '';
  }
};

// Muestra u oculta el error junto al campo. Devuelve true si es válido.
function validateField(field) {
  const message = signupValidators[field.id](field.value.trim());
  const errorSpan = document.getElementById(field.id + '-error');
  errorSpan.textContent = message;

  if (message) {
    field.setAttribute('aria-invalid', 'true');
    return false;
  }
  field.removeAttribute('aria-invalid');
  return true;
}

// Valida todos los campos y devuelve el primero con error (o null)
function validateForm() {
  let firstInvalid = null;
  Object.keys(signupValidators).forEach((id) => {
    const field = document.getElementById(id);
    if (!validateField(field) && !firstInvalid) {
      firstInvalid = field;
    }
  });
  return firstInvalid;
}

// Carga las actividades en el select
function fillActivitySelect(select) {
  activities.forEach((activity) => {
    const option = document.createElement('option');
    option.value = activity.name;
    option.textContent = `${activity.name} (${activity.getAgeRange()})`;
    select.appendChild(option);
  });
}

// Preselecciona la actividad que viene en la URL usando el objeto location.
// Ej: location.search = "?actividad=Yoga"
function preselectActivityFromUrl(select) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('actividad');
  if (name && findActivity(name)) {
    select.value = name;
  }
}

// Punto de entrada de la página: lo llama script.js
function initSignupForm() {
  const form = document.getElementById('signup-form');
  const activitySelect = document.getElementById('activity');
  const birthDateInput = document.getElementById('birthDate');
  const successMessage = document.getElementById('success-message');

  fillActivitySelect(activitySelect);
  preselectActivityFromUrl(activitySelect);

  // Validar cada campo al salir de él (blur)
  Object.keys(signupValidators).forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('blur', () => validateField(field));
  });

  // La actividad depende de la edad: se revalida si cambia alguna de las dos
  activitySelect.addEventListener('change', () => validateField(activitySelect));
  birthDateInput.addEventListener('change', () => {
    if (activitySelect.value) validateField(activitySelect);
  });

  // Envío del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // evita que la página se recargue

    const firstInvalid = validateForm();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Todo OK: confirmación en la página (sin alert)
    const firstName = document.getElementById('firstName').value.trim();
    successMessage.textContent =
      `¡Gracias, ${firstName}! Recibimos tu preinscripción a ${activitySelect.value}. ` +
      'La secretaría se va a comunicar con vos en los próximos días.';
    successMessage.hidden = false;

    form.reset();
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
