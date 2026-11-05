import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSocio } from '../contexto/SocioContext';
import {
  inscribirSocio,
  obtenerActividad,
  obtenerActividades,
  obtenerInscripcionesActivas,
  obtenerMensajeError,
  obtenerReglaError,
} from '../servicios/api';
import {
  calcularCuotaMensual,
  formatearPesos,
  obtenerPorcentajeDescuento,
} from '../utils/calcularCuotaMensual';
import { calcularEdad } from '../utils/calcularEdad';
import { COLOR_SIN_CUPO, obtenerEstiloDisciplina } from '../utils/disciplinas';
import Icono from './Icono';
import Mensaje from './Mensaje';
import MedidorCupo from './MedidorCupo';
import Confirmacion from './Confirmacion';
import './DetalleActividad.css';

// Ruta "/actividades/:id": detalle de la actividad con el botón "Inscribirme".
function DetalleActividad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socio } = useSocio();
  const [actividad, setActividad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [regla, setRegla] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  // Se vuelve a ejecutar si cambia el id de la URL.
  useEffect(() => {
    setCargando(true);
    setError('');
    setConfirmacion(null);
    obtenerActividad(id)
      .then(setActividad)
      .catch((err) => setError(obtenerMensajeError(err)))
      .finally(() => setCargando(false));
  }, [id]);

  const manejarInscripcion = async () => {
    setError('');
    setRegla(null);
    setEnviando(true);
    try {
      // Recorrido: clic -> Axios -> @RestController -> servicio (RN1..RN5) -> repositorio -> MySQL
      await inscribirSocio(socio.id, actividad.id);

      // Con la inscripción confirmada, se calcula la nueva cuota estimada (RN6).
      const [activas, todas] = await Promise.all([
        obtenerInscripcionesActivas(socio.id),
        obtenerActividades(),
      ]);
      const inscriptas = activas
        .map((i) => todas.find((a) => a.id === i.actividadId))
        .filter(Boolean);
      setConfirmacion({
        cuota: calcularCuotaMensual(inscriptas),
        porcentaje: obtenerPorcentajeDescuento(inscriptas.length),
      });
    } catch (err) {
      setError(obtenerMensajeError(err));
      setRegla(obtenerReglaError(err));
      // Si la rechazó el cupo, se actualiza la actividad para mostrarla completa.
      obtenerActividad(actividad.id).then(setActividad).catch(() => {});
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return <p className="cargando">Cargando actividad...</p>;
  }

  if (!actividad) {
    return (
      <section className="vacio">
        <span className="vacio__icono"><Icono nombre="alerta" tamano={32} /></span>
        <h2>{error || 'No se encontró la actividad.'}</h2>
        <Link to="/actividades" className="boton">Volver al catálogo</Link>
      </section>
    );
  }

  if (confirmacion) {
    return (
      <Confirmacion
        nombreSocio={socio.nombre}
        actividad={actividad}
        cuota={confirmacion.cuota}
        porcentaje={confirmacion.porcentaje}
      />
    );
  }

  const sinCupo = actividad.cupoDisponible <= 0;
  const estilo = obtenerEstiloDisciplina(actividad.disciplina);
  const edadSocio = socio && socio.fechaNacimiento ? calcularEdad(socio.fechaNacimiento) : null;
  const fueraDeEdad =
    edadSocio !== null && (edadSocio < actividad.edadMinima || edadSocio > actividad.edadMaxima);
  const moroso = socio && socio.estadoCuota === 'MOROSO';

  return (
    <section
      className={sinCupo ? 'detalle detalle--sin-cupo' : 'detalle'}
      style={{ '--color-disciplina': sinCupo ? '#475467' : estilo.color }}
    >
      <header className="detalle__portada">
        <span className="detalle__marca-agua" aria-hidden="true">
          <Icono nombre={estilo.icono} tamano={240} grosor={1.2} />
        </span>
        {/* history del navegador: vuelve a la pantalla anterior */}
        <button type="button" className="boton-icono" onClick={() => navigate(-1)} aria-label="Volver">
          <Icono nombre="volver" tamano={22} grosor={2} />
        </button>
        <div className="detalle__titulos">
          <span className="detalle__disciplina">{actividad.disciplina}</span>
          <h1>{actividad.nombre}</h1>
          <span className="detalle__profe">Con {actividad.profesor}</span>
        </div>
      </header>

      <div className="detalle__cuerpo">
        <dl className="detalle__datos">
          <div>
            <Icono nombre="calendario" tamano={20} />
            <dt>Días</dt>
            <dd>{actividad.dias}</dd>
          </div>
          <div>
            <Icono nombre="reloj" tamano={20} />
            <dt>Horario</dt>
            <dd>{actividad.horario} hs</dd>
          </div>
          <div>
            <Icono nombre="personas" tamano={20} />
            <dt>Edades</dt>
            <dd>{actividad.edadMinima} a {actividad.edadMaxima} años</dd>
          </div>
          <div>
            <Icono nombre="profesor" tamano={20} />
            <dt>Profe</dt>
            <dd>{actividad.profesor}</dd>
          </div>
        </dl>

        <div className="detalle__cupo" style={{ '--color-disciplina': sinCupo ? COLOR_SIN_CUPO : estilo.color }}>
          <MedidorCupo
            cupoDisponible={actividad.cupoDisponible}
            cupoMaximo={actividad.cupoMaximo}
            etiqueta="Lugares disponibles"
          />
        </div>

        <Mensaje
          tipo="error"
          titulo={error || null}
          regla={regla}
          onCerrar={() => { setError(''); setRegla(null); }}
        >
          {error ? 'No se hizo ningún cambio en tus inscripciones.' : null}
        </Mensaje>

        {!error && fueraDeEdad && (
          <Mensaje tipo="aviso">
            Tenés {edadSocio} años y esta actividad es para {actividad.edadMinima} a {actividad.edadMaxima} años.
          </Mensaje>
        )}
        {!error && moroso && (
          <Mensaje tipo="aviso">Tu cuota figura impaga. Regularizala en secretaría para poder anotarte.</Mensaje>
        )}
        {!error && !sinCupo && !fueraDeEdad && !moroso && (
          <Mensaje tipo="exito">Tu edad está dentro del rango y tu cuota está al día.</Mensaje>
        )}
      </div>

      <div className="detalle__accion">
        <div>
          <span className="texto-suave">Cuota mensual</span>
          <p className="detalle__precio importe">{formatearPesos(actividad.cuotaMensual)}</p>
        </div>
        <button
          type="button"
          className="boton boton--grande"
          disabled={sinCupo || enviando}
          onClick={manejarInscripcion}
        >
          {enviando ? 'Inscribiendo...' : sinCupo ? 'Sin lugares' : 'Inscribirme'}
        </button>
      </div>
    </section>
  );
}

export default DetalleActividad;
