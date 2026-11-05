import { NavLink, useNavigate } from 'react-router-dom';
import { useSocio } from '../contexto/SocioContext';
import Logo from './Logo';
import Icono from './Icono';
import './Encabezado.css';

function Encabezado() {
  const { socio, salir } = useSocio();
  const navigate = useNavigate();

  const manejarSalir = () => {
    salir();
    navigate('/');
  };

  // Iniciales para el avatar: "Lucía Alvarez" -> "LA"
  const iniciales = socio
    ? `${socio.nombre.charAt(0)}${socio.apellido.charAt(0)}`.toUpperCase()
    : '';

  return (
    <header className="encabezado">
      <div className="encabezado__barra">
        <NavLink to="/actividades" className="encabezado__marca" aria-label="Mi Club, inicio">
          <Logo variante="negativo" ancho={40} />
          <span className="encabezado__nombre-app">Mi Club</span>
        </NavLink>

        {/* Renderizado condicional: el menú solo aparece si hay un socio logueado */}
        {socio && (
          <>
            <nav className="encabezado__nav" aria-label="Navegación principal">
              <NavLink to="/actividades" end>
                <Icono nombre="grilla" tamano={22} />
                <span>Actividades</span>
              </NavLink>
              <NavLink to="/mis-actividades">
                <Icono nombre="lista" tamano={22} />
                <span>Mis actividades</span>
              </NavLink>
              <button type="button" className="encabezado__salir-movil" onClick={manejarSalir}>
                <Icono nombre="salir" tamano={22} />
                <span>Salir</span>
              </button>
            </nav>

            <div className="encabezado__usuario">
              <span className="encabezado__nombre">{socio.nombre}</span>
              <span className="avatar" aria-hidden="true">{iniciales}</span>
              <button type="button" className="encabezado__salir" onClick={manejarSalir}>
                Salir
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Encabezado;
