# SocioClub — Club Social y Deportivo Los Algarrobos

Trabajo Práctico Integrador · Taller de Construcción de Software · Universidad Siglo 21

Sistema web de gestión de socios, actividades e inscripciones con tres caras que comparten una sola base MySQL y un solo backend Spring Boot:

| Parte | Para quién | Carpeta | Tecnología |
|---|---|---|---|
| A. Sitio público del club | Vecinos | [`public/`](public) | HTML5, CSS3, JavaScript |
| B. Sistema de secretaría (backoffice) | Marta y la Comisión | [`backend/`](backend) (vistas en `src/main/resources/templates`) | Spring Boot, Spring MVC, Thymeleaf, Spring Data JPA, MySQL |
| C. API REST | App de socios | [`backend/`](backend) (`controller/api`) | Spring Boot `@RestController`, JSON |
| D. App "Mi Club" | Socios | [`app/`](app) | React, React Router, Axios |
| E. Pruebas | El equipo | `app/src/**/*.test.js`, `backend/src/test`, `backend/postman` | Jest, React Testing Library, JUnit, Postman |

## Integrantes

| Integrante | Parte principal |
|---|---|
| [Nombre y apellido] | [Parte] |
| [Nombre y apellido] | [Parte] |
| [Nombre y apellido] | [Parte] |
| [Nombre y apellido] | [Parte] |

## Requisitos

- Java 17 o superior y Maven 3.9 o superior.
- MySQL 8 (o Docker Desktop, que lo levanta solo).
- Node.js 18 o superior y npm.

Puertos: MySQL `3306`, backend `8080`, app React `3000`.

## 1. Crear la base de datos

La base se llama `socioclub`. Hay dos opciones:

- **Automática:** el backend se conecta con `createDatabaseIfNotExist=true`, crea la base y las tablas (JPA, `ddl-auto=update`) y carga los datos iniciales de [`backend/src/main/resources/data.sql`](backend/src/main/resources/data.sql) cada vez que arranca, sin duplicarlos.
- **Manual:** si el usuario de MySQL no tiene permiso para crear bases, ejecutar antes [`backend/database/create-database.sql`](backend/database/create-database.sql):

```bash
mysql -u root -p < backend/database/create-database.sql
```

Los datos iniciales son las 8 actividades de la sección 3.3 del enunciado y 15 socios de prueba (2 morosos). Ajedrez arranca con 15 de 16 lugares ocupados para demostrar la regla de cupo.

## 2. Levantar el backend (secretaría + API)

**Opción A: Docker** (levanta MySQL y el backend juntos), desde la raíz del repositorio:

```bash
docker compose up --build
```

**Opción B: Maven con MySQL local:**

```bash
cd backend
mvn spring-boot:run
```

Por defecto se conecta a `localhost:3306` con el usuario `root` sin contraseña. Para usar otros datos, definir las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` antes de arrancar:

```bash
DB_PASSWORD=mi_clave mvn spring-boot:run
```

Con el backend levantado:

- Secretaría (backoffice): http://localhost:8080
- API REST: http://localhost:8080/api/actividades

## 3. Levantar la app React "Mi Club"

Con el backend corriendo, en otra terminal:

```bash
cd app
npm install
npm start
```

Se abre en http://localhost:3000. Tiene que ser ese puerto: el backend solo acepta pedidos (CORS) desde `http://localhost:3000`.

## 4. Abrir el sitio público

Abrir [`public/pages/index.html`](public/pages/index.html) en el navegador (doble clic o con la extensión Live Server). No necesita el backend.

## 5. Usuarios y DNI de prueba

**Secretaría (backoffice)**

| DNI | Contraseña |
|---|---|
| 30111222 | 30111222 |

**Socios (app Mi Club).** La contraseña de cada socio es su mismo DNI.

| DNI | Socio | Edad | Cuota | Sirve para |
|---|---|---|---|---|
| 40123456 | Lucía Alvarez | 22 | Al día | Caso exitoso, cuota con bonificación, RN2, RN3, RN5 |
| 39234567 | Mateo Benítez | 29 | Al día | Caso exitoso |
| 42145678 | Sofía Castro | 25 | **Moroso** | RN4 |
| 35190123 | Pablo Herrera | 36 | **Moroso** | RN4 |
| 48934567 | Bruno Molina | 17 | Al día | RN3 (actividades para mayores de 18) |
| 47201234 | Camila Ibarra | 17 | Al día | RN3 |

Las edades son a noviembre de 2026. Los 15 socios están cargados en `data.sql`, todos inscriptos en Ajedrez, y aparecen en el listado de socios del backoffice.

## 6. Cómo demostrar cada regla de negocio

| Regla | Cómo probarla |
|---|---|
| RN1 · Cupo | En el backoffice, crear un socio nuevo e inscribirlo en Ajedrez (ocupa el último lugar). Crear otro e intentarlo de nuevo: "La actividad no tiene cupo disponible". |
| RN2 · Sin duplicados | Ingresar con Lucía (40123456) e inscribirse en Ajedrez: ya está inscripta. |
| RN3 · Edad | Bruno Molina (48934567) en Funcional adultos (18 a 65), o Lucía en Fútbol infantil (6 a 12). |
| RN4 · Cuota al día | Sofía Castro (42145678) en cualquier actividad menos Ajedrez (ya está inscripta ahí): "Debe regularizar su cuota en secretaría". |
| RN5 · Máximo 3 | Lucía ya tiene Ajedrez: inscribirla en Natación y en Vóley, y después intentar Yoga. |
| RN6 · Bonificación | En "Mis actividades": 10 % con 2 actividades y 15 % con 3. |
| RN7 · DNI válido | En el ingreso de la app o en el formulario de preinscripción del sitio público, escribir un DNI con puntos (40.123.456): el error aparece junto al campo. |

Las reglas RN1 a RN5 están en la capa de servicio (`InscripcionService`) y valen igual desde el backoffice y desde la app. RN6 y RN7 están en JavaScript del lado del cliente.

## 7. Pruebas

```bash
# Jest + React Testing Library (RN6, RN7, filtro por edad, TarjetaActividad, ResumenCuota)
cd app
npm test

# JUnit (reglas de inscripción y login)
cd backend
mvn test
```

**Postman:** importar [`backend/postman/SocioClub-API.postman_collection.json`](backend/postman/SocioClub-API.postman_collection.json). Usa la variable `baseUrl` (`http://localhost:8080`) e incluye los casos exitosos y de error de cada endpoint del Anexo A, más el login de socios.

## 8. Endpoints de la API

| Verbo | Ruta | Qué hace | Respuestas |
|---|---|---|---|
| GET | `/api/actividades` | Lista las actividades con su cupo disponible. Acepta `?disciplina=` | 200 |
| GET | `/api/actividades/{id}` | Detalle de una actividad | 200 / 404 |
| POST | `/api/actividades` | Crea una actividad | 201 |
| PUT | `/api/actividades/{id}` | Modifica una actividad | 200 / 404 |
| DELETE | `/api/actividades/{id}` | Elimina una actividad sin inscriptos activos | 204 / 404 / 409 |
| POST | `/api/socios/login` | Ingreso del socio con `{ "dni", "clave" }` | 200 / 401 |
| GET | `/api/socios/dni/{dni}` | Busca un socio por DNI | 200 / 404 |
| GET | `/api/socios/{id}/inscripciones` | Inscripciones activas de un socio | 200 / 404 |
| POST | `/api/inscripciones` | Inscribe un socio: `{ "socioId", "actividadId" }`. Aplica RN1 a RN5 | 201 / 404 / 409 |
| PUT | `/api/inscripciones/{id}/baja` | Baja lógica (estado BAJA) | 200 / 404 |

Cuando una regla rechaza la inscripción, la API responde `409 Conflict` con el mensaje y la regla:

```json
{ "error": "La actividad no tiene cupo disponible", "regla": "RN1" }
```

## Más detalle

- [`backend/README.md`](backend/README.md): backoffice, API y login.
- [`app/README.md`](app/README.md): rutas, componentes y conceptos de React de la app.
