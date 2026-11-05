import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSocio } from '../contexto/SocioContext';
import { ingresarSocio, obtenerMensajeError } from '../servicios/api';
import { esDniValido } from '../utils/esDniValido';
import Logo from './Logo';
import Icono from './Icono';
import Mensaje from './Mensaje';
import './Ingreso.css';

// Ruta "/": el socio escribe su DNI y su contraseña y la API los valida.
function Ingreso() {
  const { socio, ingresar } = useSocio();
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [clave, setClave] = useState('');
  const [errorDni, setErrorDni] = useState('');
  const [errorClave, setErrorClave] = useState('');
  const [errorApi, setErrorApi] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si ya hay un socio en el contexto, no tiene sentido mostrar el ingreso.
  if (socio) {
    return <Navigate to="/actividades" replace />;
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setErrorApi('');

    // RN7 del lado del cliente: el formulario no se envía si el DNI es inválido.
    const dniOk = esDniValido(dni);
    setErrorDni(dniOk ? '' : 'El DNI debe tener 7 u 8 dígitos numéricos, sin puntos.');
    setErrorClave(clave ? '' : 'Ingresá tu contraseña.');
    if (!dniOk || !clave) {
      return;
    }

    setCargando(true);
    try {
      const socioEncontrado = await ingresarSocio(dni, clave);
      ingresar(socioEncontrado);
      navigate('/actividades');
    } catch (error) {
      // 401: DNI o contraseña incorrectos (el mensaje viene de la API).
      setErrorApi(obtenerMensajeError(error));
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="ingreso">
      <div className="ingreso__portada">
        <Logo variante="negativo" ancho={88} titulo="Logo del Club Los Algarrobos" />
        <p className="ingreso__club">Club Social y Deportivo Los Algarrobos</p>
        <h1 className="ingreso__titulo">
          Tu club,<br />
          <span>en tu bolsillo.</span>
        </h1>
        <p className="ingreso__bajada">Anotate en actividades, mirá tus horarios y tu cuota del mes.</p>
      </div>

      <div className="ingreso__hoja">
        <div className="ingreso__formulario">
          <h2>Ingresá con tu DNI</h2>
          <p className="texto-suave">Ingresá con tu DNI y tu contraseña.</p>

          <form onSubmit={manejarEnvio} noValidate>
            <label htmlFor="dni" className="sobretitulo">Número de DNI</label>
            <input
              id="dni"
              name="dni"
              type="text"
              inputMode="numeric"
              autoComplete="username"
              placeholder="Ej: 40123456"
              value={dni}
              onChange={(e) => setDni(e.target.value.trim())}
              className={errorDni ? 'campo campo--dni campo--error' : 'campo campo--dni'}
              aria-invalid={Boolean(errorDni)}
              aria-describedby="dni-ayuda dni-error"
              autoFocus
            />
            <p id="dni-ayuda" className="campo__ayuda">7 u 8 números, sin puntos.</p>
            {/* RN7: el error se muestra junto al campo, no con alert() */}
            <p id="dni-error" className="campo__error">
              {errorDni && <Icono nombre="alerta" tamano={16} grosor={2} />}
              {errorDni}
            </p>

            <label htmlFor="clave" className="sobretitulo ingreso__etiqueta">Contraseña</label>
            <input
              id="clave"
              name="clave"
              type="password"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className={errorClave ? 'campo campo--clave campo--error' : 'campo campo--clave'}
              aria-invalid={Boolean(errorClave)}
              aria-describedby="clave-error"
            />
            <p id="clave-error" className="campo__error">
              {errorClave && <Icono nombre="alerta" tamano={16} grosor={2} />}
              {errorClave}
            </p>

            {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

            <button type="submit" className="boton boton--grande boton--bloque" disabled={cargando}>
              {cargando ? 'Buscando...' : 'Ingresar'}
              {!cargando && <Icono nombre="flecha" tamano={20} grosor={2} />}
            </button>
          </form>

          <p className="ingreso__ayuda">¿Todavía no sos socio? Acercate a la secretaría del club.</p>
        </div>
      </div>
    </section>
  );
}

export default Ingreso;
