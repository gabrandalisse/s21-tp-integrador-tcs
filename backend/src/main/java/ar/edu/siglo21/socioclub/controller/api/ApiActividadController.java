package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.dto.ActividadRequest;
import ar.edu.siglo21.socioclub.dto.ActividadResponse;
import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.service.ActividadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ApiActividadController {
    private final ActividadService actividadService;

    public ApiActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public List<ActividadResponse> listar(@RequestParam(required = false) String disciplina) {
        return actividadService.listarPorDisciplina(disciplina).stream().map(this::aResponse).toList();
    }

    @GetMapping("/{id}")
    public ActividadResponse detalle(@PathVariable Long id) {
        return aResponse(actividadService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ActividadResponse> crear(@Valid @RequestBody ActividadRequest request) {
        Actividad actividad = actividadService.guardar(desdeRequest(request, new Actividad()));
        return ResponseEntity.created(URI.create("/api/actividades/" + actividad.getId())).body(aResponse(actividad));
    }

    @PutMapping("/{id}")
    public ActividadResponse actualizar(@PathVariable Long id, @Valid @RequestBody ActividadRequest request) {
        Actividad actividad = actividadService.buscarPorId(id);
        return aResponse(actividadService.guardar(desdeRequest(request, actividad)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
    }

    private ActividadResponse aResponse(Actividad actividad) {
        return new ActividadResponse(actividad, actividadService.cupoDisponible(actividad));
    }

    private Actividad desdeRequest(ActividadRequest request, Actividad actividad) {
        actividad.setNombre(request.getNombre().trim());
        actividad.setDisciplina(request.getDisciplina().trim());
        actividad.setProfesor(request.getProfesor().trim());
        actividad.setDias(request.getDias().trim());
        actividad.setHorario(request.getHorario().trim());
        actividad.setEdadMinima(request.getEdadMinima());
        actividad.setEdadMaxima(request.getEdadMaxima());
        actividad.setCupoMaximo(request.getCupoMaximo());
        actividad.setCuotaMensual(request.getCuotaMensual());
        return actividad;
    }
}
