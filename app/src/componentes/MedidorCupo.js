import PropTypes from 'prop-types';
import { obtenerEstadoCupo } from '../utils/disciplinas';

// Barra de cupo: color de la disciplina, Vaina desde 80 % ocupado, rojo cuando está completo.
// El texto siempre acompaña al color.
function MedidorCupo({ cupoDisponible, cupoMaximo, etiqueta = 'Cupo' }) {
  const { nivel, ocupado } = obtenerEstadoCupo(cupoDisponible, cupoMaximo);

  let texto = `${cupoDisponible} de ${cupoMaximo} libres`;
  if (nivel === 'completo') texto = 'Completo';
  else if (cupoDisponible === 1) texto = `1 de ${cupoMaximo} libre`;

  return (
    <div className={`medidor medidor--${nivel}`}>
      <div className="medidor__texto">
        <span>{etiqueta}</span>
        <strong>{texto}</strong>
      </div>
      <div className="medidor__barra" aria-hidden="true">
        <div className="medidor__relleno" style={{ width: `${Math.max(ocupado, 3)}%` }} />
      </div>
    </div>
  );
}

MedidorCupo.propTypes = {
  cupoDisponible: PropTypes.number.isRequired,
  cupoMaximo: PropTypes.number.isRequired,
  etiqueta: PropTypes.string,
};

export default MedidorCupo;
