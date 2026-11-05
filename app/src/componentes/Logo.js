import PropTypes from 'prop-types';

// Logo del club: un algarrobo cuyo tronco forma la letra A y cuyo travesaño
// es una vaina con 8 semillas (una por disciplina). El hueco en la copa es la pelota.
// variante "color" para fondos claros y "negativo" para fondos oscuros.
const COLORES = {
  color: { copa: '#1B4D33', tronco: '#0F2A1D', vaina: '#D9A21B', semilla: '#0F2A1D' },
  negativo: { copa: '#4E9A6A', tronco: '#F5F1E8', vaina: '#D9A21B', semilla: '#0F2A1D' },
};

const SEMILLAS = [72, 80, 88, 96, 104, 112, 120, 128];

function Logo({ variante = 'color', ancho = 48, simplificado = false, titulo = null }) {
  const c = COLORES[variante] || COLORES.color;
  // En tamaños chicos se quitan semillas y pelota para que se lea bien.
  const sinDetalle = simplificado || ancho < 64;

  return (
    <svg
      width={ancho}
      height={Math.round(ancho * 0.889)}
      viewBox="10 24 180 160"
      role={titulo ? 'img' : undefined}
      aria-label={titulo || undefined}
      aria-hidden={titulo ? undefined : true}
    >
      <path
        d={
          'M14 100 C14 58 54 30 100 30 C146 30 186 58 186 100 C186 104 183 106 179 106 L21 106 C17 106 14 104 14 100 Z' +
          (sinDetalle ? '' : ' M149 66 a9 9 0 1 0 -18 0 a9 9 0 1 0 18 0 Z')
        }
        fill={c.copa}
        fillRule="evenodd"
      />
      <path d="M90 104 H110 L74 178 H52 Z M90 104 H110 L148 178 H126 Z" fill={c.tronco} />
      <path d="M54 146 C78 133 122 133 146 146 C122 159 78 159 54 146 Z" fill={c.vaina} />
      {!sinDetalle &&
        SEMILLAS.map((x) => <circle key={x} cx={x} cy="146" r="2.8" fill={c.semilla} />)}
    </svg>
  );
}

Logo.propTypes = {
  variante: PropTypes.oneOf(['color', 'negativo']),
  ancho: PropTypes.number,
  simplificado: PropTypes.bool,
  titulo: PropTypes.string,
};

export default Logo;
