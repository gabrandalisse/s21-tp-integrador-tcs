import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatearPesos } from '../utils/calcularCuotaMensual';
import { obtenerEstiloDisciplina } from '../utils/disciplinas';
import Icono from './Icono';
import './Confirmacion.css';

// Pantalla de éxito después de inscribirse: resumen y nueva cuota estimada.
function Confirmacion({ nombreSocio, actividad, cuota, porcentaje }) {
  const estilo = obtenerEstiloDisciplina(actividad.disciplina);

  return (
    <section className="confirmacion" role="status">
      <div className="confirmacion__encabezado">
        <span className="confirmacion__check">
          <Icono nombre="tilde" tamano={48} grosor={2.4} />
        </span>
        <h1>¡Listo, {nombreSocio}!</h1>
        <p>
          Quedaste inscripto/a en <strong>{actividad.nombre}</strong>.
        </p>
      </div>

      <div className="confirmacion__resumen">
        <div className="confirmacion__actividad">
          <span className="confirmacion__icono" style={{ background: estilo.color }}>
            <Icono nombre={estilo.icono} tamano={24} />
          </span>
          <div>
            <strong>{actividad.dias} · {actividad.horario} hs</strong>
            <span>Con {actividad.profesor}</span>
          </div>
        </div>
        <div className="confirmacion__cuota">
          <span>Tu nueva cuota estimada</span>
          <span className="confirmacion__monto">
            {porcentaje > 0 && <span className="insignia insignia--marca-clara">−{porcentaje} %</span>}
            <strong className="importe" data-testid="cuota-confirmacion">{formatearPesos(cuota)}</strong>
          </span>
        </div>
      </div>

      <div className="confirmacion__acciones">
        <Link to="/mis-actividades" className="boton boton--vaina boton--grande boton--bloque">
          Ver mis actividades
        </Link>
        <Link to="/actividades" className="boton boton--fantasma boton--grande boton--bloque">
          Seguir explorando
        </Link>
      </div>
    </section>
  );
}

Confirmacion.propTypes = {
  nombreSocio: PropTypes.string.isRequired,
  actividad: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    disciplina: PropTypes.string.isRequired,
    dias: PropTypes.string.isRequired,
    horario: PropTypes.string.isRequired,
    profesor: PropTypes.string.isRequired,
  }).isRequired,
  cuota: PropTypes.number.isRequired,
  porcentaje: PropTypes.number.isRequired,
};

export default Confirmacion;
