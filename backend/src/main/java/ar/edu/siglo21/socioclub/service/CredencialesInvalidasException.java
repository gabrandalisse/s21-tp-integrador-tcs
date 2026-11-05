package ar.edu.siglo21.socioclub.service;

// Se lanza cuando el DNI o la contraseña no coinciden. La API la convierte en un 401.
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
