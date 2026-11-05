import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocio } from '../contexto/SocioContext';
import {
  darDeBajaInscripcion,
  obtenerActividades,
  obtenerInscripcionesActivas,
  obtenerMensajeError,
} from '../servicios/api';
import { formatearPesos } from '../utils/calcularCuotaMensual';
import ResumenCuota from './ResumenCuota';
import Mensaje from './Mensaje';
import Icono from './Icono';
import { obtenerEstiloDisciplina } from '../utils/disciplinas';
import './MisActividades.css';

// Ruta "/mis-actividades": inscripciones activas, botón "Darme de baja" y cuota estimada (RN6).
function MisActividades() {
  const { socio } = useSocio();
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [bajaId, setBajaId] = useState(null);

  // La API de inscripciones devuelve el id y nombre de la actividad; para mostrar
  // horario y cuota se cruza con el catálogo de actividades.
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [activas, actividades] = await Promise.all([
        obtenerInscripcionesActivas(socio.id),
        obtenerActividades(),
      ]);
      const combinadas = activas.map((inscripcion) => ({
        ...inscripcion,
        actividad: actividades.find((a) => a.id === inscripcion.actividadId) || null,
      }));
      setInscripciones(combinadas);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [socio.id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const manejarBaja = async (inscripcion) => {
    setError('');
    setExito('');
    setBajaId(inscripcion.id);
    try {
      await darDeBajaInscripcion(inscripcion.id);
      setExito(`Te diste de baja de ${inscripcion.actividadNombre}.`);
      // Se quita de la lista local: la inscripción quedó en estado BAJA.
      setInscripciones((actuales) => actuales.filter((i) => i.id !== inscripcion.id));
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setBajaId(null);
    }
  };

  // Para la cuota solo se necesitan las actividades con su cuotaMensual.
  const actividadesParaCuota = inscripciones
    .filter((i) => i.actividad)
    .map((i) => ({ id: i.actividad.id, nombre: i.actividad.nombre, cuotaMensual: i.actividad.cuotaMensual }));

  const moroso = socio.estadoCuota === 'MOROSO';
  const iniciales = `${socio.nombre.charAt(0)}${socio.apellido.charAt(0)}`.toUpperCase();

  return (
    <section className="mis">
      <header className="mis__perfil">
        <span className="avatar avatar--grande" aria-hidden="true">{iniciales}</span>
        <div className="mis__datos">
          <h1>{socio.nombre} {socio.apellido}</h1>
          <span>Socio/a · DNI {socio.dni}</span>
        </div>
        <span className={moroso ? 'insignia insignia--error' : 'insignia insignia--exito'}>
          {moroso ? 'Cuota impaga' : 'Cuota al día'}
        </span>
      </header>

      <div className="mis__contenido">
        <ResumenCuota actividades={actividadesParaCuota} />

        <div className="mis__columna">
          {moroso && (
            <Mensaje tipo="aviso">
              Tu cuota social figura impaga. Podés ver el catálogo y darte de baja, pero para anotarte
              tenés que regularizarla en secretaría.
            </Mensaje>
          )}
          <Mensaje tipo="error" onCerrar={() => setError('')}>{error}</Mensaje>
          <Mensaje tipo="exito" onCerrar={() => setExito('')}>{exito}</Mensaje>

          <h2 className="mis__titulo">Mis actividades</h2>

          {cargando ? (
            <p className="cargando">Cargando tus inscripciones...</p>
          ) : inscripciones.length === 0 ? (
            // Renderizado condicional: mensaje cuando el socio no tiene actividades.
            <div className="vacio">
              <span className="vacio__icono"><Icono nombre="vacio" tamano={32} /></span>
              <h2>Todavía no estás inscripto/a en ninguna actividad</h2>
              <p>Mirá qué hay en el club: hay opciones para todas las edades.</p>
              <Link to="/actividades" className="boton">Ver actividades</Link>
            </div>
          ) : (
            <ul className="inscripciones">
              {inscripciones.map((inscripcion) => {
                const estilo = obtenerEstiloDisciplina(
                  inscripcion.actividad ? inscripcion.actividad.disciplina : ''
                );
                return (
                  <li key={inscripcion.id} className="inscripcion">
                    <div className="inscripcion__fila">
                      <span className="inscripcion__icono" style={{ background: estilo.color }}>
                        <Icono nombre={estilo.icono} tamano={24} />
                      </span>
                      <div className="inscripcion__info">
                        <h3>{inscripcion.actividadNombre}</h3>
                        {inscripcion.actividad && (
                          <p>
                            {inscripcion.actividad.dias} · {inscripcion.actividad.horario} ·{' '}
                            {inscripcion.actividad.profesor}
                          </p>
                        )}
                      </div>
                      {inscripcion.actividad && (
                        <strong className="importe inscripcion__monto">
                          {formatearPesos(inscripcion.actividad.cuotaMensual)}
                        </strong>
                      )}
                    </div>
                    <div className="inscripcion__pie">
                      <span>
                        Desde el{' '}
                        {new Date(inscripcion.fechaInscripcion + 'T00:00:00').toLocaleDateString('es-AR')}
                      </span>
                      <button
                        type="button"
                        className="boton boton--peligro"
                        disabled={bajaId === inscripcion.id}
                        onClick={() => manejarBaja(inscripcion)}
                      >
                        {bajaId === inscripcion.id ? 'Procesando...' : 'Darme de baja'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default MisActividades;
