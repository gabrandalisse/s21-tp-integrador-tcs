package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.dto.InscripcionResponse;
import ar.edu.siglo21.socioclub.dto.LoginRequest;
import ar.edu.siglo21.socioclub.dto.SocioResponse;
import ar.edu.siglo21.socioclub.service.InscripcionService;
import ar.edu.siglo21.socioclub.service.SocioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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

    // Ingreso a la app: 200 con el socio si el DNI y la contraseña coinciden, 401 si no.
    @PostMapping("/login")
    public SocioResponse login(@Valid @RequestBody LoginRequest request) {
        return new SocioResponse(socioService.ingresar(request.getDni(), request.getClave()));
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
