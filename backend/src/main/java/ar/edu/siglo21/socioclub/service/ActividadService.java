package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.repository.ActividadRepository;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ActividadService {
    private final ActividadRepository actividadRepository;
    private final InscripcionRepository inscripcionRepository;

    public ActividadService(ActividadRepository actividadRepository, InscripcionRepository inscripcionRepository) {
        this.actividadRepository = actividadRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    @Transactional(readOnly = true)
    public List<Actividad> listar() {
        return actividadRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Actividad buscarPorId(Long id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la actividad solicitada."));
    }

    public Actividad guardar(Actividad actividad) {
        validarEdades(actividad);
        return actividadRepository.save(actividad);
    }

    public void eliminar(Long id) {
        Actividad actividad = buscarPorId(id);
        if (inscripcionRepository.contarActivasPorActividad(id) > 0) {
            throw new ReglaNegocioException("ACTIVIDAD_CON_INSCRIPTOS", "No se puede eliminar una actividad con inscriptos activos.");
        }
        actividadRepository.delete(actividad);
    }

    @Transactional(readOnly = true)
    public long cupoDisponible(Actividad actividad) {
        return actividad.getCupoMaximo() - inscripcionRepository.contarActivasPorActividad(actividad.getId());
    }

    private void validarEdades(Actividad actividad) {
        if (actividad.getEdadMinima() != null && actividad.getEdadMaxima() != null
                && actividad.getEdadMinima() > actividad.getEdadMaxima()) {
            throw new IllegalArgumentException("La edad mínima no puede ser mayor que la edad máxima.");
        }
    }
}
