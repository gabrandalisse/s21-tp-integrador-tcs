import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatearPesos } from '../utils/calcularCuotaMensual';
import { COLOR_SIN_CUPO, obtenerEstiloDisciplina } from '../utils/disciplinas';
import Icono from './Icono';
import MedidorCupo from './MedidorCupo';
import './TarjetaActividad.css';

// Muestra una actividad. Recibe los datos por props desde ListaActividades.
function TarjetaActividad({ actividad, onInscribir = null, inscribiendo = false }) {
  const sinCupo = actividad.cupoDisponible <= 0;
  const ultimos = !sinCupo && actividad.cupoDisponible <= 3;
  const estilo = obtenerEstiloDisciplina(actividad.disciplina);
  const color = sinCupo ? COLOR_SIN_CUPO : estilo.color;

  // Clase aplicada dinámicamente: la tarjeta se ve en gris cuando no hay cupo.
  const clases = sinCupo ? 'tarjeta tarjeta--sin-cupo' : 'tarjeta';

  return (
    <article className={clases} style={{ '--color-disciplina': color }}>
      <div className="tarjeta__cabecera">
        <span className="tarjeta__icono">
          <Icono nombre={estilo.icono} tamano={24} />
        </span>
        <span className="tarjeta__disciplina">{actividad.disciplina}</span>
        {sinCupo && <span className="insignia insignia--error">Sin cupo</span>}
        {ultimos && (
          <span className="insignia insignia--aviso">
            {actividad.cupoDisponible === 1 ? 'Último lugar' : `Últimos ${actividad.cupoDisponible}`}
          </span>
        )}
        {!sinCupo && !ultimos && (
          <span className="insignia insignia--exito">{actividad.cupoDisponible} lugares</span>
        )}
      </div>

      <h3 className="tarjeta__titulo">
        {/* El nombre lleva al detalle de la actividad */}
        <Link to={`/actividades/${actividad.id}`}>{actividad.nombre}</Link>
      </h3>

      <ul className="tarjeta__datos">
        <li><Icono nombre="calendario" tamano={18} />{actividad.dias} · {actividad.horario} hs</li>
        <li><Icono nombre="personas" tamano={18} />{actividad.edadMinima} a {actividad.edadMaxima} años</li>
        <li><Icono nombre="profesor" tamano={18} />{actividad.profesor}</li>
      </ul>

      <MedidorCupo cupoDisponible={actividad.cupoDisponible} cupoMaximo={actividad.cupoMaximo || 0} />

      <div className="tarjeta__pie">
        <p className="tarjeta__precio importe">
          {formatearPesos(actividad.cuotaMensual)}
          <small>/mes</small>
        </p>
        <div className="tarjeta__acciones">
          {onInscribir && (
            <button
              type="button"
              className="boton"
              disabled={sinCupo || inscribiendo}
              onClick={() => onInscribir(actividad)}
            >
              {inscribiendo ? 'Inscribiendo...' : 'Inscribirme'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

TarjetaActividad.propTypes = {
  actividad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    disciplina: PropTypes.string.isRequired,
    profesor: PropTypes.string.isRequired,
    dias: PropTypes.string.isRequired,
    horario: PropTypes.string.isRequired,
    edadMinima: PropTypes.number.isRequired,
    edadMaxima: PropTypes.number.isRequired,
    cupoMaximo: PropTypes.number,
    cupoDisponible: PropTypes.number.isRequired,
    cuotaMensual: PropTypes.number.isRequired,
  }).isRequired,
  onInscribir: PropTypes.func,
  inscribiendo: PropTypes.bool,
};

export default TarjetaActividad;
