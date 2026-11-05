package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

// Pruebas del ingreso de socios (app Mi Club) y de la secretaría (backoffice).
class LoginServiceTest {

    @Test
    void elSocioIngresaConSuDniComoContrasena() {
        SocioRepository repositorio = mock(SocioRepository.class);
        Socio socio = new Socio();
        socio.setDni("40123456");
        when(repositorio.findByDni("40123456")).thenReturn(Optional.of(socio));

        Socio resultado = new SocioService(repositorio).ingresar("40123456", "40123456");

        assertEquals("40123456", resultado.getDni());
    }

    @Test
    void conContrasenaIncorrectaSeRechaza() {
        SocioRepository repositorio = mock(SocioRepository.class);
        Socio socio = new Socio();
        socio.setDni("40123456");
        when(repositorio.findByDni("40123456")).thenReturn(Optional.of(socio));

        assertThrows(CredencialesInvalidasException.class,
                () -> new SocioService(repositorio).ingresar("40123456", "1234"));
    }

    @Test
    void conUnDniQueNoExisteSeRechazaConElMismoMensaje() {
        SocioRepository repositorio = mock(SocioRepository.class);
        when(repositorio.findByDni("99999999")).thenReturn(Optional.empty());

        CredencialesInvalidasException error = assertThrows(CredencialesInvalidasException.class,
                () -> new SocioService(repositorio).ingresar("99999999", "99999999"));
        assertEquals("DNI o contraseña incorrectos.", error.getMessage());
    }

    @Test
    void laSecretariaIngresaSoloConSusDatos() {
        SecretariaService secretaria = new SecretariaService("30111222", "30111222");
        assertTrue(secretaria.validar("30111222", "30111222"));
        assertFalse(secretaria.validar("30111222", "otra"));
        assertFalse(secretaria.validar("40123456", "40123456"));
    }
}
