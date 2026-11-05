import PropTypes from 'prop-types';
import Icono from './Icono';

const ICONOS = { error: 'alerta', exito: 'check', aviso: 'aviso', info: 'info' };

// Caja de mensaje reutilizable. Si la API rechazó la operación por una regla
// de negocio (409), se muestra también el código de la regla (RN1..RN5).
function Mensaje({ tipo = 'info', titulo = null, children = null, regla = null, onCerrar = null }) {
  if (!children && !titulo) return null;
  return (
    <div className={`mensaje mensaje--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icono nombre={ICONOS[tipo]} tamano={22} grosor={2} className="mensaje__icono" />
      <div className="mensaje__cuerpo">
        {titulo && <span className="mensaje__titulo">{titulo}</span>}
        {children && <span>{children}</span>}
        {regla && <span className="mensaje__regla">Regla {regla}</span>}
      </div>
      {onCerrar && (
        <button type="button" className="mensaje__cerrar" onClick={onCerrar} aria-label="Cerrar mensaje">
          <Icono nombre="cerrar" tamano={18} grosor={2} />
        </button>
      )}
    </div>
  );
}

Mensaje.propTypes = {
  tipo: PropTypes.oneOf(['error', 'exito', 'aviso', 'info']),
  titulo: PropTypes.node,
  children: PropTypes.node,
  regla: PropTypes.string,
  onCerrar: PropTypes.func,
};

export default Mensaje;
