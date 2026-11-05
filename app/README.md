# App "Mi Club" (React) — Parte D

App para socios del Club Los Algarrobos. Consume la API REST del backend Spring Boot (`/backend`).

## Cómo levantarla

Requisitos: Node 18 o superior y el backend corriendo en `http://localhost:8080`.

```bash
cd app
npm install
npm start          # abre http://localhost:3000
npm test           # pruebas Jest + React Testing Library
```

> **Ojo en Windows:** abrí la terminal en la ruta con las mayúsculas exactas de la carpeta (por ejemplo `cd /d/Develop/...`, no `/d/develop/...`). Si cambia una mayúscula, ESLint tira `Plugin "react" was conflicted between ...`. Para evitarlo, `app/.env` trae `DISABLE_ESLINT_PLUGIN=true`.

Si la API está en otra URL, copiar `.env.example` a `.env.local` y cambiar `REACT_APP_API_URL`.

## DNI de prueba

Para ingresar: DNI y contraseña. La contraseña de cada socio es su mismo DNI (lo valida `POST /api/socios/login`).

| DNI | Socio | Para demostrar |
|---|---|---|
| 40123456 | Lucía Alvarez (AL_DIA) | Ingreso, inscripción, baja, cuota |
| 42145678 | Sofía Castro (MOROSO) | RN4 — cuota impaga |
| 35190123 | Pablo Herrera (MOROSO) | RN4 |
| 48934567 | Bruno Molina (2009) | RN3 — edad (ej.: Funcional adultos) |
| 40.123.456 | — | RN7 — DNI inválido (no se envía) |

Ajedrez arranca con 1 lugar libre: al inscribir a alguien queda "Sin cupo" (RN1).

## Rutas (React Router, `BrowserRouter`)

| Ruta | Componente | Qué hace |
|---|---|---|
| `/` | `Ingreso` | El socio escribe su DNI y su contraseña; se validan con `POST /api/socios/login` (401 si no coinciden) |
| `/actividades` | `ListaActividades` | Catálogo con filtro por disciplina (`?disciplina=` en la API) y por edad (RF2, en el cliente) y cupo disponible |
| `/actividades/:id` | `DetalleActividad` | Detalle + botón "Inscribirme" (`POST /api/inscripciones`) |
| `/mis-actividades` | `MisActividades` + `ResumenCuota` | Inscripciones activas, "Darme de baja" (`PUT /api/inscripciones/{id}/baja`) y cuota estimada (RN6) |

Las rutas internas están envueltas en `RutaProtegida`: sin socio en el contexto, redirige a `/`.

## Estructura

```
src/
  App.js                    rutas + SocioProvider
  contexto/SocioContext.js  createContext / useContext con el socio logueado
  servicios/api.js          TODAS las llamadas Axios a la API y el manejo de errores (409)
  utils/
    esDniValido.js          RN7 (función pura, probada con Jest)
    calcularCuotaMensual.js RN6 (función pura, probada con Jest)
    calcularEdad.js
    filtrarPorEdad.js       RF2: filtro por edad (función pura, probada con Jest)
  componentes/
    Encabezado, Pie, Ingreso, ListaActividades, TarjetaActividad,
    DetalleActividad, MisActividades, ResumenCuota, Mensaje,
    RutaProtegida, NoEncontrada  (cada uno con su .css)
```

## Conceptos de la materia y dónde están

- **Props + PropTypes**: `TarjetaActividad`, `ResumenCuota`, `Mensaje`, `RutaProtegida`.
- **useState / useEffect**: `ListaActividades` (efecto con dependencia `[disciplina, recargar]`), `DetalleActividad` (`[id]`), `MisActividades`.
- **Contexto**: `SocioContext` — el socio se lee con `useSocio()` en Encabezado, Ingreso, Lista, Detalle y MisActividades sin pasar props.
- **Listas con `map` y `key`**: tarjetas, opciones del filtro, inscripciones, líneas de la cuota.
- **Renderizado condicional**: etiqueta "Sin cupo" y botón deshabilitado; mensaje "Todavía no estás inscripto/a"; menú solo con socio logueado.
- **Clase CSS dinámica**: `tarjeta--sin-cupo` (tarjeta en gris), `campo--error`, `estado--moroso`.
- **Errores de la API visibles**: `obtenerMensajeError()` en `api.js` toma el campo `error` del 409 y el componente lo muestra en `<Mensaje>`.

## Pruebas (Parte E)

- `utils/esDniValido.test.js` — 7 casos: 7 y 8 dígitos, con puntos, con letras, 6 y 9 dígitos, vacíos.
- `utils/calcularCuotaMensual.test.js` — 0, 1, 2 y 3 actividades, entrada inválida, montos como texto.
- `componentes/TarjetaActividad.test.js` — muestra el nombre; con cupo 0 muestra "Sin cupo" y el botón está deshabilitado; clase gris; clic llama a `onInscribir`.
- `componentes/ResumenCuota.test.js` — total en $ 0 y bonificación del 10 %.
- `utils/filtrarPorEdad.test.js` — bordes del rango, edades 10 y 22, sin edad y edades inválidas (RF2).

## Recorrido de una inscripción

Clic en "Inscribirme" → `inscribirSocio()` en `servicios/api.js` (Axios `POST /api/inscripciones`) → `ApiInscripcionController` → `InscripcionService.inscribir()` valida RN1–RN5 → `InscripcionRepository.save()` → MySQL → respuesta 201 (o 409 con `{ error, regla }`) → el componente actualiza el estado y React vuelve a dibujar la pantalla.
