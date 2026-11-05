import { useEffect, useMemo, useState } from 'react';
import { useSocio } from '../contexto/SocioContext';
import {
  inscribirSocio,
  obtenerActividades,
  obtenerMensajeError,
  obtenerReglaError,
} from '../servicios/api';
import TarjetaActividad from './TarjetaActividad';
import Mensaje from './Mensaje';
import Icono from './Icono';
import { obtenerEstiloDisciplina } from '../utils/disciplinas';
import { filtrarPorEdad, interpretarEdad } from '../utils/filtrarPorEdad';
import { calcularEdad } from '../utils/calcularEdad';
import './ListaActividades.css';

// Ruta "/actividades": catálogo con filtro por disciplina y por edad (RF2) e indicación de cupo.
function ListaActividades() {
  const { socio } = useSocio();
  const [actividades, setActividades] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplina, setDisciplina] = useState('');
  const [edadTexto, setEdadTexto] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [regla, setRegla] = useState(null);
  const [exito, setExito] = useState('');
  const [inscribiendoId, setInscribiendoId] = useState(null);
  const [recargar, setRecargar] = useState(0);

  // Carga inicial de todas las disciplinas para armar el <select>.
  // Arreglo de dependencias vacío: se ejecuta una sola vez al montar el componente.
  useEffect(() => {
    obtenerActividades()
      .then((todas) => {
        const unicas = [...new Set(todas.map((a) => a.disciplina))].sort();
        setDisciplinas(unicas);
      })
      .catch(() => setDisciplinas([]));
  }, []);

  // Cada vez que cambia la disciplina elegida (o se pide recargar), se vuelve a pedir la lista a la API.
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError('');
    obtenerActividades(disciplina)
      .then((datos) => {
        if (!cancelado) setActividades(datos);
      })
      .catch((err) => {
        if (!cancelado) setError(obtenerMensajeError(err));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [disciplina, recargar]);

  // Filtro por edad: la disciplina la filtra la API (?disciplina=) y la edad se filtra
  // en el cliente sobre esa lista. Es estado derivado: se recalcula cuando cambia algo.
  const edadSocio = socio.fechaNacimiento ? calcularEdad(socio.fechaNacimiento) : null;
  const edad = interpretarEdad(edadTexto);
  const edadInvalida = edadTexto !== '' && edad === null;
  const visibles = useMemo(() => filtrarPorEdad(actividades, edad), [actividades, edad]);

  const totalLugares = useMemo(
    () => visibles.reduce((suma, a) => suma + Math.max(a.cupoDisponible, 0), 0),
    [visibles]
  );

  const limpiarFiltros = () => {
    setDisciplina('');
    setEdadTexto('');
  };

  const manejarInscripcion = async (actividad) => {
    setError('');
    setRegla(null);
    setExito('');
    setInscribiendoId(actividad.id);
    try {
      await inscribirSocio(socio.id, actividad.id);
      setExito(`¡Listo! Quedaste inscripto/a en ${actividad.nombre}.`);
      setRecargar((n) => n + 1); // refresca el cupo disponible
    } catch (err) {
      // Acá llegan los 409 de las reglas RN1 a RN5 con su mensaje y el código de la regla.
      setError(obtenerMensajeError(err));
      setRegla(obtenerReglaError(err));
    } finally {
      setInscribiendoId(null);
      // Objeto window del navegador: sube al principio para que se vea el mensaje.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="lista">
      <div className="lista__portada">
        <p className="lista__saludo">Hola, {socio.nombre}</p>
        <h1>¿Qué querés hacer este mes?</h1>
        <p className="lista__resumen">
          {visibles.length} {visibles.length === 1 ? 'actividad' : 'actividades'} · {totalLugares} lugares libres
        </p>
      </div>

      {/* Filtro por disciplina: cada chip es un botón; al hacer clic cambia el estado
          y el useEffect vuelve a pedir la lista filtrada a la API. */}
      <div className="lista__filtros" role="group" aria-label="Filtrar por disciplina">
        <button
          type="button"
          className="chip"
          aria-pressed={disciplina === ''}
          onClick={() => setDisciplina('')}
        >
          Todas
        </button>
        {disciplinas.map((d) => (
          <button
            key={d}
            type="button"
            className="chip"
            aria-pressed={disciplina === d}
            onClick={() => setDisciplina(d)}
          >
            <span className="chip__punto" style={{ background: obtenerEstiloDisciplina(d).color }} />
            {d}
          </button>
        ))}
      </div>

      <div className="lista__edad">
        <label htmlFor="filtro-edad" className="sobretitulo">Edad</label>
        <input
          id="filtro-edad"
          type="number"
          inputMode="numeric"
          min="1"
          max="99"
          placeholder="Ej: 10"
          value={edadTexto}
          onChange={(e) => setEdadTexto(e.target.value)}
          className={edadInvalida ? 'campo lista__campo-edad campo--error' : 'campo lista__campo-edad'}
          aria-invalid={edadInvalida}
          aria-describedby="filtro-edad-ayuda"
        />
        {edadSocio !== null && (
          <button
            type="button"
            className="chip"
            aria-pressed={edad === edadSocio}
            onClick={() => setEdadTexto(edad === edadSocio ? '' : String(edadSocio))}
          >
            Mi edad · {edadSocio} años
          </button>
        )}
        {(disciplina !== '' || edadTexto !== '') && (
          <button type="button" className="lista__limpiar" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
        <p id="filtro-edad-ayuda" className={edadInvalida ? 'campo__error lista__ayuda' : 'campo__ayuda lista__ayuda'}>
          {edadInvalida ? 'Ingresá una edad entre 1 y 99.' : 'Mostramos solo las actividades para esa edad.'}
        </p>
      </div>

      <Mensaje tipo="error" regla={regla} onCerrar={() => { setError(''); setRegla(null); }}>{error}</Mensaje>
      <Mensaje tipo="exito" onCerrar={() => setExito('')}>{exito}</Mensaje>

      {cargando && <p className="cargando">Cargando actividades...</p>}

      {!cargando && visibles.length === 0 && !error && (
        <div className="vacio">
          <span className="vacio__icono"><Icono nombre="vacio" tamano={32} /></span>
          <h2>
            {edad !== null
              ? `No hay actividades${disciplina ? ` de ${disciplina}` : ''} para ${edad} años`
              : 'No hay actividades para esta disciplina'}
          </h2>
          <button type="button" className="boton" onClick={limpiarFiltros}>Ver todas</button>
        </div>
      )}

      {!cargando && (
        <div className="grilla">
          {visibles.map((actividad) => (
            <TarjetaActividad
              key={actividad.id}
              actividad={actividad}
              onInscribir={manejarInscripcion}
              inscribiendo={inscribiendoId === actividad.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaActividades;
