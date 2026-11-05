package ar.edu.siglo21.socioclub.dto;

import ar.edu.siglo21.socioclub.model.Inscripcion;

import java.time.LocalDate;

public class InscripcionResponse {
    private final Long id; private final LocalDate fechaInscripcion; private final String estado;
    private final Long socioId; private final String socioNombre; private final Long actividadId; private final String actividadNombre;

    public InscripcionResponse(Inscripcion inscripcion) {
        this.id = inscripcion.getId(); this.fechaInscripcion = inscripcion.getFechaInscripcion(); this.estado = inscripcion.getEstado().name();
        this.socioId = inscripcion.getSocio().getId(); this.socioNombre = inscripcion.getSocio().getNombreCompleto();
        this.actividadId = inscripcion.getActividad().getId(); this.actividadNombre = inscripcion.getActividad().getNombre();
    }

    public Long getId() { return id; } public LocalDate getFechaInscripcion() { return fechaInscripcion; } public String getEstado() { return estado; }
    public Long getSocioId() { return socioId; } public String getSocioNombre() { return socioNombre; }
    public Long getActividadId() { return actividadId; } public String getActividadNombre() { return actividadNombre; }
}
