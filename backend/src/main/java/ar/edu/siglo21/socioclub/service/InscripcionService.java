package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.*;
import ar.edu.siglo21.socioclub.repository.ActividadRepository;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@Transactional
public class InscripcionService {
    private final InscripcionRepository inscripcionRepository;
    private final SocioRepository socioRepository;
    private final ActividadRepository actividadRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository, SocioRepository socioRepository,
                              ActividadRepository actividadRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.socioRepository = socioRepository;
        this.actividadRepository = actividadRepository;
    }

    public Inscripcion inscribir(Long socioId, Long actividadId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el socio seleccionado."));
        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró la actividad seleccionada."));

        validarCupo(actividad);
        validarDuplicado(socioId, actividadId);
        validarEdad(socio, actividad);
        validarCuota(socio);
        validarMaximoActividades(socioId);

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setSocio(socio);
        inscripcion.setActividad(actividad);
        inscripcion.setFechaInscripcion(LocalDate.now());
        inscripcion.setEstado(EstadoInscripcion.ACTIVA);
        return inscripcionRepository.save(inscripcion);
    }

    public Inscripcion darDeBaja(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró la inscripción solicitada."));
        inscripcion.setEstado(EstadoInscripcion.BAJA);
        return inscripcionRepository.save(inscripcion);
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> listarActivasPorActividad(Long actividadId) {
        return inscripcionRepository.findByActividadIdAndEstadoOrderBySocioApellidoAscSocioNombreAsc(
                actividadId, EstadoInscripcion.ACTIVA);
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> listarActivasPorSocio(Long socioId) {
        if (!socioRepository.existsById(socioId)) {
            throw new RecursoNoEncontradoException("No se encontró el socio solicitado.");
        }
        return inscripcionRepository.findBySocioIdAndEstado(socioId, EstadoInscripcion.ACTIVA);
    }

    private void validarCupo(Actividad actividad) {
        if (inscripcionRepository.contarActivasPorActividad(actividad.getId()) >= actividad.getCupoMaximo()) {
            throw new ReglaNegocioException("RN1", "La actividad no tiene cupo disponible.");
        }
    }

    private void validarDuplicado(Long socioId, Long actividadId) {
        if (inscripcionRepository.existsBySocioIdAndActividadIdAndEstado(socioId, actividadId, EstadoInscripcion.ACTIVA)) {
            throw new ReglaNegocioException("RN2", "El socio ya está inscripto en esta actividad.");
        }
    }

    private void validarEdad(Socio socio, Actividad actividad) {
        int edad = Period.between(socio.getFechaNacimiento(), LocalDate.now()).getYears();
        if (edad < actividad.getEdadMinima() || edad > actividad.getEdadMaxima()) {
            throw new ReglaNegocioException("RN3", "La actividad es para personas de "
                    + actividad.getEdadMinima() + " a " + actividad.getEdadMaxima() + " años.");
        }
    }

    private void validarCuota(Socio socio) {
        if (socio.getEstadoCuota() == EstadoCuota.MOROSO) {
            throw new ReglaNegocioException("RN4", "Debe regularizar su cuota en secretaría.");
        }
    }

    private void validarMaximoActividades(Long socioId) {
        if (inscripcionRepository.countBySocioIdAndEstado(socioId, EstadoInscripcion.ACTIVA) >= 3) {
            throw new ReglaNegocioException("RN5", "Alcanzó el máximo de 3 actividades.");
        }
    }
}
