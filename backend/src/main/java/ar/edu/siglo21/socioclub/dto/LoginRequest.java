package ar.edu.siglo21.socioclub.dto;

import jakarta.validation.constraints.NotBlank;

// Cuerpo del POST /api/socios/login: { "dni": "40123456", "clave": "40123456" }
public class LoginRequest {
    @NotBlank private String dni;
    @NotBlank private String clave;
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
}
