package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SocioService {
    private final SocioRepository socioRepository;

    public SocioService(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    @Transactional(readOnly = true)
    public Page<Socio> listar(String apellido, Pageable pageable) {
        return socioRepository.findByApellidoContainingIgnoreCase(apellido == null ? "" : apellido.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public List<Socio> listarTodos() {
        return socioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Socio buscarPorId(Long id) {
        return socioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el socio solicitado."));
    }

    public Socio guardar(Socio socio) {
        String dni = socio.getDni() == null ? "" : socio.getDni().trim();
        boolean repetido = socio.getId() == null
                ? socioRepository.findByDni(dni).isPresent()
                : socioRepository.existsByDniAndIdNot(dni, socio.getId());
        if (repetido) {
            throw new IllegalArgumentException("Ya existe un socio con ese DNI.");
        }
        socio.setDni(dni);
        return socioRepository.save(socio);
    }
}
