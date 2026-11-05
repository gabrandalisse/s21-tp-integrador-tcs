import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SocioProvider } from './contexto/SocioContext';
import Encabezado from './componentes/Encabezado';
import Pie from './componentes/Pie';
import Ingreso from './componentes/Ingreso';
import ListaActividades from './componentes/ListaActividades';
import DetalleActividad from './componentes/DetalleActividad';
import MisActividades from './componentes/MisActividades';
import RutaProtegida from './componentes/RutaProtegida';
import NoEncontrada from './componentes/NoEncontrada';
import './App.css';

// Estructura común de todas las pantallas. La pantalla de ingreso ocupa todo el ancho.
function Estructura() {
  const { pathname } = useLocation();
  const esIngreso = pathname === '/';

  return (
    <div className="aplicacion">
      {!esIngreso && <Encabezado />}
      <main className={esIngreso ? 'contenido contenido--completo' : 'contenido'}>
        <Routes>
          <Route path="/" element={<Ingreso />} />
          <Route
            path="/actividades"
            element={<RutaProtegida><ListaActividades /></RutaProtegida>}
          />
          <Route
            path="/actividades/:id"
            element={<RutaProtegida><DetalleActividad /></RutaProtegida>}
          />
          <Route
            path="/mis-actividades"
            element={<RutaProtegida><MisActividades /></RutaProtegida>}
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      {!esIngreso && <Pie />}
    </div>
  );
}

// Componente raíz: provee el contexto del socio y el router.
function App() {
  return (
    <SocioProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Estructura />
      </BrowserRouter>
    </SocioProvider>
  );
}

export default App;
