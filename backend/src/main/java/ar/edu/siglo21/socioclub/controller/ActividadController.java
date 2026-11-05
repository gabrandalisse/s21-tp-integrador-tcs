package ar.edu.siglo21.socioclub.controller;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.service.ActividadService;
import ar.edu.siglo21.socioclub.service.InscripcionService;
import ar.edu.siglo21.socioclub.service.ReglaNegocioException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/actividades")
public class ActividadController {
    private final ActividadService actividadService;
    private final InscripcionService inscripcionService;

    public ActividadController(ActividadService actividadService, InscripcionService inscripcionService) {
        this.actividadService = actividadService;
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public String listar(Model model) {
        Map<Long, Long> cuposDisponibles = new HashMap<>();
        actividadService.listar().forEach(actividad ->
                cuposDisponibles.put(actividad.getId(), actividadService.cupoDisponible(actividad)));
        model.addAttribute("actividades", actividadService.listar());
        model.addAttribute("cuposDisponibles", cuposDisponibles);
        return "actividades/lista";
    }

    @GetMapping("/nueva")
    public String nueva(Model model) {
        prepararFormulario(model, new Actividad(), "Nueva actividad");
        return "actividades/formulario";
    }

    @PostMapping("/nueva")
    public String crear(@Valid @ModelAttribute("actividad") Actividad actividad, BindingResult result,
                        Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            prepararFormulario(model, actividad, "Nueva actividad");
            return "actividades/formulario";
        }
        try {
            actividadService.guardar(actividad);
            redirectAttributes.addFlashAttribute("exito", "La actividad fue creada correctamente.");
            return "redirect:/actividades";
        } catch (IllegalArgumentException exception) {
            model.addAttribute("error", exception.getMessage());
            prepararFormulario(model, actividad, "Nueva actividad");
            return "actividades/formulario";
        }
    }

    @GetMapping("/{id}/editar")
    public String editar(@PathVariable Long id, Model model) {
        prepararFormulario(model, actividadService.buscarPorId(id), "Editar actividad");
        return "actividades/formulario";
    }

    @PostMapping("/{id}/editar")
    public String actualizar(@PathVariable Long id, @Valid @ModelAttribute("actividad") Actividad actividad,
                             BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        actividad.setId(id);
        if (result.hasErrors()) {
            prepararFormulario(model, actividad, "Editar actividad");
            return "actividades/formulario";
        }
        try {
            actividadService.guardar(actividad);
            redirectAttributes.addFlashAttribute("exito", "La actividad fue actualizada correctamente.");
            return "redirect:/actividades";
        } catch (IllegalArgumentException exception) {
            model.addAttribute("error", exception.getMessage());
            prepararFormulario(model, actividad, "Editar actividad");
            return "actividades/formulario";
        }
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            actividadService.eliminar(id);
            redirectAttributes.addFlashAttribute("exito", "La actividad fue eliminada.");
        } catch (ReglaNegocioException | IllegalArgumentException exception) {
            redirectAttributes.addFlashAttribute("error", exception.getMessage());
        }
        return "redirect:/actividades";
    }

    @GetMapping("/{id}/inscriptos")
    public String inscriptos(@PathVariable Long id, Model model) {
        Actividad actividad = actividadService.buscarPorId(id);
        model.addAttribute("actividad", actividad);
        model.addAttribute("inscripciones", inscripcionService.listarActivasPorActividad(id));
        model.addAttribute("cupoDisponible", actividadService.cupoDisponible(actividad));
        return "actividades/inscriptos";
    }

    private void prepararFormulario(Model model, Actividad actividad, String titulo) {
        model.addAttribute("actividad", actividad);
        model.addAttribute("titulo", titulo);
    }
}
