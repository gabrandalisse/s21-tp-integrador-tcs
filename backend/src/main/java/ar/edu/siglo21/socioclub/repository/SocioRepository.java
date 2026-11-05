package ar.edu.siglo21.socioclub.repository;

import ar.edu.siglo21.socioclub.model.Socio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocioRepository extends JpaRepository<Socio, Long> {
    Page<Socio> findByApellidoContainingIgnoreCase(String apellido, Pageable pageable);
    Optional<Socio> findByDni(String dni);
    boolean existsByDniAndIdNot(String dni, Long id);
}
