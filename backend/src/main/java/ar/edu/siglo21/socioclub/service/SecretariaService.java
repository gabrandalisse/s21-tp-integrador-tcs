package ar.edu.siglo21.socioclub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

// Valida el ingreso de la secretaría al backoffice.
// El usuario y la contraseña se leen de application.properties con @Value.
@Service
public class SecretariaService {
    private final String dni;
    private final String clave;

    public SecretariaService(@Value("${secretaria.dni}") String dni,
                             @Value("${secretaria.clave}") String clave) {
        this.dni = dni;
        this.clave = clave;
    }

    public boolean validar(String dniIngresado, String claveIngresada) {
        return dni.equals(dniIngresado) && clave.equals(claveIngresada);
    }
}
