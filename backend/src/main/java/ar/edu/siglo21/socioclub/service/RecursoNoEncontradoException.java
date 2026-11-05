package ar.edu.siglo21.socioclub.service;

public class RecursoNoEncontradoException extends IllegalArgumentException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
