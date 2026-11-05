import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TarjetaActividad from './TarjetaActividad';

const actividadBase = {
  id: 1,
  nombre: 'Fútbol infantil',
  disciplina: 'Fútbol',
  profesor: 'Diego Ferreyra',
  dias: 'Lun y Mié',
  horario: '18:00',
  edadMinima: 6,
  edadMaxima: 12,
  cupoMaximo: 40,
  cupoDisponible: 10,
  cuotaMensual: 18000,
};

// TarjetaActividad usa <Link>, por eso se renderiza dentro de un MemoryRouter.
function renderizar(actividad, onInscribir = jest.fn()) {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TarjetaActividad actividad={actividad} onInscribir={onInscribir} />
    </MemoryRouter>
  );
  return onInscribir;
}

describe('TarjetaActividad', () => {
  test('muestra el nombre de la actividad', () => {
    renderizar(actividadBase);
    expect(screen.getByText('Fútbol infantil')).toBeInTheDocument();
    expect(screen.getByText(/Diego Ferreyra/)).toBeInTheDocument();
  });

  test('con cupo 0 muestra "Sin cupo" y el botón está deshabilitado', () => {
    renderizar({ ...actividadBase, cupoDisponible: 0 });
    expect(screen.getByText('Sin cupo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeDisabled();
  });

  test('con cupo 0 la tarjeta tiene la clase de sin cupo', () => {
    renderizar({ ...actividadBase, cupoDisponible: 0 });
    expect(screen.getByRole('article')).toHaveClass('tarjeta--sin-cupo');
  });

  test('con cupo disponible, al hacer clic en Inscribirme llama a onInscribir', () => {
    const onInscribir = renderizar(actividadBase);
    const boton = screen.getByRole('button', { name: 'Inscribirme' });
    expect(boton).toBeEnabled();
    fireEvent.click(boton);
    expect(onInscribir).toHaveBeenCalledWith(actividadBase);
  });
});
