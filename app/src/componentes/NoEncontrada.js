import { Link } from 'react-router-dom';

function NoEncontrada() {
  return (
    <section className="vacio">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
      <Link to="/" className="boton">Ir al inicio</Link>
    </section>
  );
}

export default NoEncontrada;
