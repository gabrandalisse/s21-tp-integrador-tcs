# Backoffice SocioClub

## Requisitos

- Java 17 o superior.
- Maven 3.9 o superior.
- MySQL 8.

## Primera ejecución

1. Ejecutar `database/create-database.sql` en MySQL, si el usuario de la aplicación no puede crear bases de datos.
2. Configurar las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` si no se utiliza MySQL local con usuario `root` sin contraseña.
3. Ejecutar `mvn spring-boot:run` dentro de esta carpeta.
4. Abrir `http://localhost:8080` e ingresar con el usuario de la secretaría.

## Ingreso (login)

| Dónde | Usuario | Contraseña |
|---|---|---|
| Backoffice (secretaría) | DNI `30111222` | `30111222` |
| App Mi Club (socios) | DNI del socio, por ejemplo `40123456` | el mismo DNI |

- **Backoffice:** `LoginController` valida con `SecretariaService` (usuario y clave en `application.properties`) y guarda una marca en la sesión HTTP. `SesionInterceptor`, registrado en `WebConfig`, revisa esa marca antes de cada pantalla y, si no está, redirige a `/login`. "Salir" invalida la sesión.
- **App de socios:** `POST /api/socios/login` con `{ "dni", "clave" }`. `SocioService.ingresar` compara la clave con el DNI del socio: devuelve 200 con el socio o 401 con `DNI o contraseña incorrectos.` (mismo mensaje si el DNI no existe, para no revelar qué DNI están cargados).
- No se usa Spring Security porque no se vio en la materia. En un sistema real la contraseña se guardaría hasheada (por ejemplo con BCrypt) y no sería el DNI.

La aplicación crea las tablas y carga las ocho actividades y quince socios de prueba. Ajedrez queda con quince de dieciséis cupos ocupados para demostrar la regla de cupo.

## API REST

La API se publica debajo de `/api`. Incluye actividades, búsqueda de socios por DNI e inscripciones. La colección de Postman está en `postman/SocioClub-API.postman_collection.json` e incluye los casos exitosos y de error para RN1 a RN5.

La app React puede consultar la API desde `http://localhost:3000`; CORS ya está configurado para ese origen.

## Ejecución con Docker

Desde la raíz del repositorio ejecutar `docker compose up --build`. Esto levanta MySQL y el backoffice; luego abrir `http://localhost:8080/actividades`.
