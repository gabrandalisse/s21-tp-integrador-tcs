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
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el socio solicitado."));
    }

    @Transactional(readOnly = true)
    public Socio buscarPorDni(String dni) {
        return socioRepository.findByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró un socio con ese DNI."));
    }

    // Ingreso del socio a la app "Mi Club". Por ahora la contraseña de cada socio es su propio DNI.
    // Si el DNI no existe o la contraseña no coincide se responde el mismo mensaje,
    // así nadie puede averiguar qué DNI están cargados en el club.
    @Transactional(readOnly = true)
    public Socio ingresar(String dni, String clave) {
        Socio socio = socioRepository.findByDni(dni == null ? "" : dni.trim()).orElse(null);
        if (socio == null || !socio.getDni().equals(clave)) {
            throw new CredencialesInvalidasException("DNI o contraseña incorrectos.");
        }
        return socio;
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
