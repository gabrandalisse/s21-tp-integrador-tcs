// Toda la comunicación con el backend Spring Boot está centralizada en este archivo.
// Los componentes nunca usan Axios directamente: llaman a estas funciones.
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Convierte cualquier error de Axios en un mensaje legible para el socio.
// Cuando una regla de negocio rechaza la operación, la API responde 409
// con un cuerpo { error: "...", regla: "RN1" }.
export function obtenerMensajeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    if (data && data.error) {
      return data.error;
    }
    if (status === 404) return 'No se encontró el recurso solicitado.';
    return `Error del servidor (${status}).`;
  }
  if (error.request) {
    return 'No se pudo conectar con el servidor. Verificá que el backend esté levantado.';
  }
  return error.message;
}

// Devuelve el código de la regla de negocio que rechazó la operación (RN1..RN5), si vino en el 409.
export function obtenerReglaError(error) {
  return error && error.response && error.response.data ? error.response.data.regla || null : null;
}

// POST /api/socios/login  { dni, clave } -> 200 con el socio, o 401 si no coinciden
export async function ingresarSocio(dni, clave) {
  const respuesta = await api.post('/socios/login', { dni, clave });
  return respuesta.data;
}

// GET /api/socios/dni/{dni}
export async function buscarSocioPorDni(dni) {
  const respuesta = await api.get(`/socios/dni/${dni}`);
  return respuesta.data;
}

// GET /api/actividades?disciplina=Fútbol
export async function obtenerActividades(disciplina) {
  const params = disciplina ? { disciplina } : {};
  const respuesta = await api.get('/actividades', { params });
  return respuesta.data;
}

// GET /api/actividades/{id}
export async function obtenerActividad(id) {
  const respuesta = await api.get(`/actividades/${id}`);
  return respuesta.data;
}

// GET /api/socios/{id}/inscripciones (solo las ACTIVAS)
export async function obtenerInscripcionesActivas(socioId) {
  const respuesta = await api.get(`/socios/${socioId}/inscripciones`);
  return respuesta.data;
}

// POST /api/inscripciones  { socioId, actividadId }
export async function inscribirSocio(socioId, actividadId) {
  const respuesta = await api.post('/inscripciones', { socioId, actividadId });
  return respuesta.data;
}

// PUT /api/inscripciones/{id}/baja  (baja lógica)
export async function darDeBajaInscripcion(inscripcionId) {
  const respuesta = await api.put(`/inscripciones/${inscripcionId}/baja`);
  return respuesta.data;
}

export default api;
