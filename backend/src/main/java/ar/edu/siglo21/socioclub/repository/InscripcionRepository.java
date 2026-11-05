package ar.edu.siglo21.socioclub.repository;

import ar.edu.siglo21.socioclub.model.EstadoInscripcion;
import ar.edu.siglo21.socioclub.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    @Query("select count(i) from Inscripcion i where i.actividad.id = :actividadId and i.estado = ar.edu.siglo21.socioclub.model.EstadoInscripcion.ACTIVA")
    long contarActivasPorActividad(@Param("actividadId") Long actividadId);

    boolean existsBySocioIdAndActividadIdAndEstado(Long socioId, Long actividadId, EstadoInscripcion estado);
    long countBySocioIdAndEstado(Long socioId, EstadoInscripcion estado);
    List<Inscripcion> findByActividadIdAndEstadoOrderBySocioApellidoAscSocioNombreAsc(Long actividadId, EstadoInscripcion estado);
    List<Inscripcion> findBySocioIdAndEstado(Long socioId, EstadoInscripcion estado);
}
