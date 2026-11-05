package ar.edu.siglo21.socioclub.dto;

import ar.edu.siglo21.socioclub.model.Actividad;

import java.math.BigDecimal;

public class ActividadResponse {
    private final Long id;
    private final String nombre;
    private final String disciplina;
    private final String profesor;
    private final String dias;
    private final String horario;
    private final Integer edadMinima;
    private final Integer edadMaxima;
    private final Integer cupoMaximo;
    private final long cupoDisponible;
    private final BigDecimal cuotaMensual;

    public ActividadResponse(Actividad actividad, long cupoDisponible) {
        this.id = actividad.getId(); this.nombre = actividad.getNombre(); this.disciplina = actividad.getDisciplina();
        this.profesor = actividad.getProfesor(); this.dias = actividad.getDias(); this.horario = actividad.getHorario();
        this.edadMinima = actividad.getEdadMinima(); this.edadMaxima = actividad.getEdadMaxima();
        this.cupoMaximo = actividad.getCupoMaximo(); this.cupoDisponible = cupoDisponible;
        this.cuotaMensual = actividad.getCuotaMensual();
    }

    public Long getId() { return id; } public String getNombre() { return nombre; } public String getDisciplina() { return disciplina; }
    public String getProfesor() { return profesor; } public String getDias() { return dias; } public String getHorario() { return horario; }
    public Integer getEdadMinima() { return edadMinima; } public Integer getEdadMaxima() { return edadMaxima; }
    public Integer getCupoMaximo() { return cupoMaximo; } public long getCupoDisponible() { return cupoDisponible; }
    public BigDecimal getCuotaMensual() { return cuotaMensual; }
}
