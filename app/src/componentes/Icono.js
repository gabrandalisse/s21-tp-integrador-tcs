import PropTypes from 'prop-types';

// Íconos de línea del design system: trazo 1,8 px sobre una grilla de 24 px.
const TRAZOS = {
  calendario: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  personas: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.8 3 2.6 3.5 5.2" /></>,
  profesor: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></>,
  tilde: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></>,
  alerta: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4.5M12 16v.01" /></>,
  aviso: <><path d="M12 3l9.5 17h-19z" /><path d="M12 10v4M12 17.5v.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>,
  grilla: <><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></>,
  lista: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  salir: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />,
  volver: <path d="M15 18l-6-6 6-6" />,
  siguiente: <path d="M9 6l6 6-6 6" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  vacio: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4M10 15h4" /></>,
  // Disciplinas
  futbol: <><circle cx="12" cy="12" r="9" /><path d="M12 7l4 3-1.5 4.5h-5L8 10z" /></>,
  voley: <><circle cx="12" cy="12" r="9" /><path d="M12 3c-2 4-2 8 0 9M12 12c4 0 7.5-2 8.5-5M12 12c-2 3.5-5.5 5.5-8.5 5" /></>,
  basquet: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8" /></>,
  natacion: <><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" /><path d="M2 13.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5" /><circle cx="16.5" cy="5.5" r="2" /><path d="M5 10l5-4 3.5 3.5" /></>,
  patin: <><path d="M6 3h5v8l5 2a3 3 0 0 1 2 3v1H6z" /><path d="M4 21h16" /><path d="M8 17v4M16 17v4" /></>,
  ajedrez: <><circle cx="12" cy="6" r="2.5" /><path d="M9.5 10.5h5l-1 4.5h-3z" /><path d="M7 20h10l-1.5-5h-7z" /></>,
  fitness: <path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />,
  bienestar: <><circle cx="12" cy="4.5" r="2" /><path d="M12 7.5v6M5 10.5l7 1.5 7-1.5M6 19c2.5-.5 4.5-2.5 6-5 1.5 2.5 3.5 4.5 6 5" /></>,
  medalla: <><circle cx="12" cy="14" r="6" /><path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6" /></>,
};

function Icono({ nombre, tamano = 24, grosor = 1.8, className = undefined }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRAZOS[nombre] || TRAZOS.medalla}
    </svg>
  );
}

Icono.propTypes = {
  nombre: PropTypes.string.isRequired,
  tamano: PropTypes.number,
  grosor: PropTypes.number,
  className: PropTypes.string,
};

export default Icono;
