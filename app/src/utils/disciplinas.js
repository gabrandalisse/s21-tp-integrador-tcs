// Color e ícono de cada disciplina según el design system.
// Todos los colores pasan 4,5:1 con texto blanco. Se usan solo para identificar
// la disciplina (ícono, barra de cupo, portada del detalle), nunca para acciones.
const ESTILOS = {
  'Fútbol': { color: '#2E7D4F', icono: 'futbol' },
  'Vóley': { color: '#A85A00', icono: 'voley' },
  'Básquet': { color: '#B23A1E', icono: 'basquet' },
  'Natación': { color: '#1C64A8', icono: 'natacion' },
  'Patín': { color: '#A8305F', icono: 'patin' },
  'Ajedrez': { color: '#475467', icono: 'ajedrez' },
  'Fitness': { color: '#6A3BB8', icono: 'fitness' },
  'Bienestar': { color: '#0B7A70', icono: 'bienestar' },
};

const POR_DEFECTO = { color: '#1B4D33', icono: 'medalla' };

export const COLOR_SIN_CUPO = '#9A9384';

export function obtenerEstiloDisciplina(disciplina) {
  return ESTILOS[disciplina] || POR_DEFECTO;
}

// Estado del medidor de cupo: color de disciplina hasta 80 % ocupado,
// Vaina desde 80 % y Error cuando está completo.
export function obtenerEstadoCupo(cupoDisponible, cupoMaximo) {
  const ocupado = cupoMaximo ? Math.round(((cupoMaximo - cupoDisponible) / cupoMaximo) * 100) : 0;
  if (cupoDisponible <= 0) return { nivel: 'completo', ocupado: 100 };
  if (ocupado >= 80) return { nivel: 'casi', ocupado };
  return { nivel: 'normal', ocupado };
}
