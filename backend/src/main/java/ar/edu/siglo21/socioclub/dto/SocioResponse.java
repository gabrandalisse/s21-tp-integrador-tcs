package ar.edu.siglo21.socioclub.dto;

import ar.edu.siglo21.socioclub.model.Socio;

import java.time.LocalDate;

public class SocioResponse {
    private final Long id; private final String dni; private final String nombre; private final String apellido;
    private final LocalDate fechaNacimiento; private final String email; private final String telefono; private final String estadoCuota;

    public SocioResponse(Socio socio) {
        this.id = socio.getId(); this.dni = socio.getDni(); this.nombre = socio.getNombre(); this.apellido = socio.getApellido();
        this.fechaNacimiento = socio.getFechaNacimiento(); this.email = socio.getEmail(); this.telefono = socio.getTelefono();
        this.estadoCuota = socio.getEstadoCuota().name();
    }

    public Long getId() { return id; } public String getDni() { return dni; } public String getNombre() { return nombre; }
    public String getApellido() { return apellido; } public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public String getEmail() { return email; } public String getTelefono() { return telefono; } public String getEstadoCuota() { return estadoCuota; }
}
