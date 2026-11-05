package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.*;
import ar.edu.siglo21.socioclub.repository.ActividadRepository;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class InscripcionServiceTest {
    @Mock private InscripcionRepository inscripcionRepository;
    @Mock private SocioRepository socioRepository;
    @Mock private ActividadRepository actividadRepository;

    private InscripcionService service;
    private Socio socio;
    private Actividad actividad;

    @BeforeEach
    void prepararEscenarioValido() {
        service = new InscripcionService(inscripcionRepository, socioRepository, actividadRepository);
        socio = socio(1L, EstadoCuota.AL_DIA, LocalDate.now().minusYears(20));
        actividad = actividad(1L, 6, 65, 20);
        when(socioRepository.findById(1L)).thenReturn(Optional.of(socio));
        when(actividadRepository.findById(1L)).thenReturn(Optional.of(actividad));
        when(inscripcionRepository.contarActivasPorActividad(1L)).thenReturn(0L);
        when(inscripcionRepository.existsBySocioIdAndActividadIdAndEstado(1L, 1L, EstadoInscripcion.ACTIVA)).thenReturn(false);
        when(inscripcionRepository.countBySocioIdAndEstado(1L, EstadoInscripcion.ACTIVA)).thenReturn(0L);
        when(inscripcionRepository.save(any(Inscripcion.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void creaUnaInscripcionCuandoSeCumplenTodasLasReglas() {
        service.inscribir(1L, 1L);
        ArgumentCaptor<Inscripcion> captor = ArgumentCaptor.forClass(Inscripcion.class);
        verify(inscripcionRepository).save(captor.capture());
        assertEquals(EstadoInscripcion.ACTIVA, captor.getValue().getEstado());
        assertEquals(socio, captor.getValue().getSocio());
        assertEquals(actividad, captor.getValue().getActividad());
    }

    @Test
    void rechazaCuandoNoHayCupoDisponible() {
        when(inscripcionRepository.contarActivasPorActividad(1L)).thenReturn(20L);
        assertRegla("RN1");
    }

    @Test
    void rechazaUnaInscripcionDuplicada() {
        when(inscripcionRepository.existsBySocioIdAndActividadIdAndEstado(1L, 1L, EstadoInscripcion.ACTIVA)).thenReturn(true);
        assertRegla("RN2");
    }

    @Test
    void rechazaSiLaEdadNoEstaEnElRango() {
        socio.setFechaNacimiento(LocalDate.now().minusYears(5));
        assertRegla("RN3");
    }

    @Test
    void rechazaAUnSocioMoroso() {
        socio.setEstadoCuota(EstadoCuota.MOROSO);
        assertRegla("RN4");
    }

    @Test
    void rechazaUnaCuartaActividadActiva() {
        when(inscripcionRepository.countBySocioIdAndEstado(1L, EstadoInscripcion.ACTIVA)).thenReturn(3L);
        assertRegla("RN5");
    }

    private void assertRegla(String reglaEsperada) {
        ReglaNegocioException exception = assertThrows(ReglaNegocioException.class, () -> service.inscribir(1L, 1L));
        assertEquals(reglaEsperada, exception.getRegla());
        verify(inscripcionRepository, never()).save(any());
    }

    private Socio socio(Long id, EstadoCuota estadoCuota, LocalDate fechaNacimiento) {
        Socio socio = new Socio();
        socio.setId(id);
        socio.setEstadoCuota(estadoCuota);
        socio.setFechaNacimiento(fechaNacimiento);
        return socio;
    }

    private Actividad actividad(Long id, int edadMinima, int edadMaxima, int cupoMaximo) {
        Actividad actividad = new Actividad();
        actividad.setId(id);
        actividad.setEdadMinima(edadMinima);
        actividad.setEdadMaxima(edadMaxima);
        actividad.setCupoMaximo(cupoMaximo);
        actividad.setCuotaMensual(BigDecimal.TEN);
        return actividad;
    }
}
