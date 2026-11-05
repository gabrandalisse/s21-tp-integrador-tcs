package ar.edu.siglo21.socioclub.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fechaInscripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoInscripcion estado = EstadoInscripcion.ACTIVA;

    @ManyToOne(optional = false)
    @JoinColumn(name = "socio_id", nullable = false)
    private Socio socio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFechaInscripcion() { return fechaInscripcion; }
    public void setFechaInscripcion(LocalDate fechaInscripcion) { this.fechaInscripcion = fechaInscripcion; }
    public EstadoInscripcion getEstado() { return estado; }
    public void setEstado(EstadoInscripcion estado) { this.estado = estado; }
    public Socio getSocio() { return socio; }
    public void setSocio(Socio socio) { this.socio = socio; }
    public Actividad getActividad() { return actividad; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
}
