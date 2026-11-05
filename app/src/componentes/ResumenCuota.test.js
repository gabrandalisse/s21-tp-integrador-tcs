import { render, screen } from '@testing-library/react';
import ResumenCuota from './ResumenCuota';

describe('ResumenCuota', () => {
  test('sin actividades muestra total $ 0', () => {
    render(<ResumenCuota actividades={[]} />);
    expect(screen.getByTestId('total-cuota')).toHaveTextContent('$ 0');
  });

  test('con 2 actividades muestra la bonificación del 10 %', () => {
    render(
      <ResumenCuota
        actividades={[
          { id: 1, nombre: 'Fútbol infantil', cuotaMensual: 18000 },
          { id: 2, nombre: 'Vóley mixto', cuotaMensual: 20000 },
        ]}
      />
    );
    expect(screen.getByText('Bonificación 10 %')).toBeInTheDocument();
    expect(screen.getByTestId('total-cuota')).toHaveTextContent('$ 34.200');
  });
});
