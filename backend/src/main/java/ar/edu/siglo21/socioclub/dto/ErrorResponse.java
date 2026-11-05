package ar.edu.siglo21.socioclub.dto;

public class ErrorResponse {
    private final String error;
    private final String regla;
    public ErrorResponse(String error, String regla) { this.error = error; this.regla = regla; }
    public String getError() { return error; }
    public String getRegla() { return regla; }
}
