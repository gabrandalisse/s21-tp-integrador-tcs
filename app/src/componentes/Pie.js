import Logo from './Logo';
import './Pie.css';

function Pie() {
  const anio = new Date().getFullYear();
  return (
    <footer className="pie">
      <Logo variante="negativo" ancho={36} />
      <div>
        <p className="pie__club">Club Social y Deportivo Los Algarrobos</p>
        <p>Zona norte de Córdoba · © {anio} · Consultas en secretaría</p>
      </div>
    </footer>
  );
}

export default Pie;
