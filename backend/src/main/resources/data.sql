-- Actividades requeridas por la consigna. INSERT IGNORE permite reiniciar la aplicación sin duplicarlas.
INSERT IGNORE INTO actividades (nombre, disciplina, profesor, dias, horario, edad_minima, edad_maxima, cupo_maximo, cuota_mensual) VALUES
('Fútbol infantil', 'Fútbol', 'Diego Ferreyra', 'Lun y Mié', '18:00', 6, 12, 40, 18000.00),
('Vóley mixto', 'Vóley', 'Laura Ceballos', 'Mar y Jue', '19:00', 13, 60, 24, 20000.00),
('Básquet juvenil', 'Básquet', 'Martín Oviedo', 'Lun y Vie', '19:30', 12, 17, 20, 19000.00),
('Natación', 'Natación', 'Sofía Bustos', 'Mar y Jue', '17:00', 5, 70, 30, 26000.00),
('Patín artístico', 'Patín', 'Carla Peralta', 'Mié y Vie', '17:30', 5, 15, 25, 21000.00),
('Ajedrez', 'Ajedrez', 'Raúl Giménez', 'Sáb', '10:00', 8, 99, 16, 9000.00),
('Funcional adultos', 'Fitness', 'Paula Luna', 'Lun, Mié y Vie', '20:30', 18, 65, 30, 22000.00),
('Yoga', 'Bienestar', 'Inés Arguello', 'Mar y Jue', '09:00', 16, 99, 15, 17000.00);

-- Quince socios de prueba, incluidos dos MOROSOS.
INSERT IGNORE INTO socios (dni, nombre, apellido, fecha_nacimiento, email, telefono, estado_cuota) VALUES
('40123456', 'Lucía', 'Alvarez', '2004-05-12', 'lucia.alvarez@example.com', '351 4101001', 'AL_DIA'),
('39234567', 'Mateo', 'Benítez', '1996-11-18', 'mateo.benitez@example.com', '351 4101002', 'AL_DIA'),
('42145678', 'Sofía', 'Castro', '2001-02-08', 'sofia.castro@example.com', '351 4101003', 'MOROSO'),
('45256789', 'Tomás', 'Díaz', '2006-07-21', 'tomas.diaz@example.com', '351 4101004', 'AL_DIA'),
('43867890', 'Valentina', 'Espinosa', '2003-09-03', 'valentina.espinosa@example.com', '351 4101005', 'AL_DIA'),
('37178901', 'Juan', 'Fernández', '1993-01-29', 'juan.fernandez@example.com', '351 4101006', 'AL_DIA'),
('46489012', 'Martina', 'Gómez', '2007-04-14', 'martina.gomez@example.com', '351 4101007', 'AL_DIA'),
('35190123', 'Pablo', 'Herrera', '1990-10-10', 'pablo.herrera@example.com', '351 4101008', 'MOROSO'),
('47201234', 'Camila', 'Ibarra', '2008-12-01', 'camila.ibarra@example.com', '351 4101009', 'AL_DIA'),
('41812345', 'Nicolás', 'Juárez', '2000-03-16', 'nicolas.juarez@example.com', '351 4101010', 'AL_DIA'),
('33223456', 'Ana', 'López', '1987-06-25', 'ana.lopez@example.com', '351 4101011', 'AL_DIA'),
('48934567', 'Bruno', 'Molina', '2009-08-19', 'bruno.molina@example.com', '351 4101012', 'AL_DIA'),
('40745678', 'Julieta', 'Navarro', '1998-02-27', 'julieta.navarro@example.com', '351 4101013', 'AL_DIA'),
('45956789', 'Felipe', 'Ortega', '2005-11-06', 'felipe.ortega@example.com', '351 4101014', 'AL_DIA'),
('38667890', 'Carolina', 'Paz', '1995-05-30', 'carolina.paz@example.com', '351 4101015', 'AL_DIA');

-- Ajedrez queda con 15 de 16 lugares ocupados para demostrar RN1 (cupo máximo).
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '40123456' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '39234567' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '42145678' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '45256789' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '43867890' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '37178901' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '46489012' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '35190123' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '47201234' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '41812345' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '33223456' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '48934567' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '40745678' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '45956789' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
INSERT INTO inscripciones (fecha_inscripcion, estado, socio_id, actividad_id)
SELECT CURRENT_DATE, 'ACTIVA', s.id, a.id FROM socios s CROSS JOIN actividades a
WHERE s.dni = '38667890' AND a.nombre = 'Ajedrez'
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.socio_id = s.id AND i.actividad_id = a.id AND i.estado = 'ACTIVA');
