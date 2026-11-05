// El socio que ingresó se guarda en un contexto para que cualquier pantalla
// lo pueda leer con useContext, sin pasarlo por props de componente en componente.
import { createContext, useContext, useState } from 'react';

const SocioContext = createContext(null);

const CLAVE_STORAGE = 'miClubSocio';

// Lee el socio guardado en la pestaña para no perder la sesión al recargar (F5).
function leerSocioGuardado() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_STORAGE);
    return guardado ? JSON.parse(guardado) : null;
  } catch (e) {
    return null;
  }
}

export function SocioProvider({ children }) {
  const [socio, setSocio] = useState(leerSocioGuardado);

  const ingresar = (socioEncontrado) => {
    setSocio(socioEncontrado);
    try {
      sessionStorage.setItem(CLAVE_STORAGE, JSON.stringify(socioEncontrado));
    } catch (e) {
      // Si el navegador no permite storage, la sesión vive solo en memoria.
    }
  };

  const salir = () => {
    setSocio(null);
    try {
      sessionStorage.removeItem(CLAVE_STORAGE);
    } catch (e) {
      // sin acción
    }
  };

  return (
    <SocioContext.Provider value={{ socio, ingresar, salir }}>
      {children}
    </SocioContext.Provider>
  );
}

// Hook propio para usar el contexto con una sola línea: const { socio } = useSocio();
export function useSocio() {
  return useContext(SocioContext);
}

export default SocioContext;
