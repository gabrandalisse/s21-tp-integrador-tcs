package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.dto.CrearInscripcionRequest;
import ar.edu.siglo21.socioclub.dto.InscripcionResponse;
import ar.edu.siglo21.socioclub.model.Inscripcion;
import ar.edu.siglo21.socioclub.service.InscripcionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/inscripciones")
public class ApiInscripcionController {
    private final InscripcionService inscripcionService;

    public ApiInscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @PostMapping
    public ResponseEntity<InscripcionResponse> crear(@Valid @RequestBody CrearInscripcionRequest request) {
        Inscripcion inscripcion = inscripcionService.inscribir(request.getSocioId(), request.getActividadId());
        return ResponseEntity.created(URI.create("/api/inscripciones/" + inscripcion.getId()))
                .body(new InscripcionResponse(inscripcion));
    }

    @PutMapping("/{id}/baja")
    public InscripcionResponse darDeBaja(@PathVariable Long id) {
        return new InscripcionResponse(inscripcionService.darDeBaja(id));
    }
}
