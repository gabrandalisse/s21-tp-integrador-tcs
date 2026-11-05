import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSocio } from '../contexto/SocioContext';

// Si no hay socio en el contexto, redirige al ingreso por DNI.
function RutaProtegida({ children }) {
  const { socio } = useSocio();
  if (!socio) {
    return <Navigate to="/" replace />;
  }
  return children;
}

RutaProtegida.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RutaProtegida;
