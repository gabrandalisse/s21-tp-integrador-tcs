import PropTypes from 'prop-types';
import {
  calcularCuotaMensual,
  formatearPesos,
  obtenerPorcentajeDescuento,
} from '../utils/calcularCuotaMensual';
import './ResumenCuota.css';

// Muestra la cuota mensual estimada (RN6) a partir de las actividades recibidas por props.
function ResumenCuota({ actividades }) {
  const subtotal = actividades.reduce((suma, a) => suma + Number(a.cuotaMensual), 0);
  const porcentaje = obtenerPorcentajeDescuento(actividades.length);
  const total = calcularCuotaMensual(actividades);
  const mes = new Date().toLocaleDateString('es-AR', { month: 'long' });

  let pista = 'Con 2 actividades tenés 10 % de bonificación y con 3, 15 %.';
  if (actividades.length === 1) pista = 'Con una actividad más tenés 10 % de bonificación.';
  if (actividades.length === 2) pista = 'Con una más, la bonificación sube a 15 %.';
  if (actividades.length >= 3) pista = 'Tenés la bonificación máxima. Máximo 3 actividades por socio.';

  return (
    <aside className="resumen" aria-labelledby="resumen-titulo">
      <div className="resumen__cabecera">
        <h2 id="resumen-titulo" className="sobretitulo">Tu cuota de {mes}</h2>
        {porcentaje > 0 && <span className="insignia insignia--marca">−{porcentaje} %</span>}
      </div>

      <p className="resumen__total">
        <strong className="importe" data-testid="total-cuota">{formatearPesos(total)}</strong>
        {porcentaje > 0 && <s>{formatearPesos(subtotal)}</s>}
      </p>

      {actividades.length > 0 && (
        <ul className="resumen__lineas">
          {actividades.map((a) => (
            <li key={a.id}>
              <span>{a.nombre}</span>
              <span>{formatearPesos(a.cuotaMensual)}</span>
            </li>
          ))}
          {porcentaje > 0 && (
            <li className="resumen__descuento">
              <span>Bonificación {porcentaje} %</span>
              <span>− {formatearPesos(subtotal - total)}</span>
            </li>
          )}
        </ul>
      )}

      <p className="resumen__pista">{pista}</p>
    </aside>
  );
}

ResumenCuota.propTypes = {
  actividades: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cuotaMensual: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ResumenCuota;
