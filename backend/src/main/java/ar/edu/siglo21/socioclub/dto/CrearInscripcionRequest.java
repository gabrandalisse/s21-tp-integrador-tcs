package ar.edu.siglo21.socioclub.dto;

import jakarta.validation.constraints.NotNull;

public class CrearInscripcionRequest {
    @NotNull private Long socioId;
    @NotNull private Long actividadId;
    public Long getSocioId() { return socioId; }
    public void setSocioId(Long socioId) { this.socioId = socioId; }
    public Long getActividadId() { return actividadId; }
    public void setActividadId(Long actividadId) { this.actividadId = actividadId; }
}
