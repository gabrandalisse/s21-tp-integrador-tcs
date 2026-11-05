package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.dto.InscripcionResponse;
import ar.edu.siglo21.socioclub.dto.SocioResponse;
import ar.edu.siglo21.socioclub.service.InscripcionService;
import ar.edu.siglo21.socioclub.service.SocioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/socios")
public class ApiSocioController {
    private final SocioService socioService;
    private final InscripcionService inscripcionService;

    public ApiSocioController(SocioService socioService, InscripcionService inscripcionService) {
        this.socioService = socioService;
        this.inscripcionService = inscripcionService;
    }

    @GetMapping("/dni/{dni}")
    public SocioResponse buscarPorDni(@PathVariable String dni) {
        return new SocioResponse(socioService.buscarPorDni(dni));
    }

    @GetMapping("/{id}/inscripciones")
    public List<InscripcionResponse> inscripcionesActivas(@PathVariable Long id) {
        return inscripcionService.listarActivasPorSocio(id).stream().map(InscripcionResponse::new).toList();
    }
}
