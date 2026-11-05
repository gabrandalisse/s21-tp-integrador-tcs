# Backoffice SocioClub

## Requisitos

- Java 17 o superior.
- Maven 3.9 o superior.
- MySQL 8.

## Primera ejecución

1. Ejecutar `database/create-database.sql` en MySQL, si el usuario de la aplicación no puede crear bases de datos.
2. Configurar las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` si no se utiliza MySQL local con usuario `root` sin contraseña.
3. Ejecutar `mvn spring-boot:run` dentro de esta carpeta.
4. Abrir `http://localhost:8080/actividades`.

La aplicación crea las tablas y carga las ocho actividades y quince socios de prueba. Ajedrez queda con quince de dieciséis cupos ocupados para demostrar la regla de cupo.

## Ejecución con Docker

Desde la raíz del repositorio ejecutar `docker compose up --build`. Esto levanta MySQL y el backoffice; luego abrir `http://localhost:8080/actividades`.
