package ar.edu.siglo21.socioclub.controller;

import ar.edu.siglo21.socioclub.service.ActividadService;
import ar.edu.siglo21.socioclub.service.InscripcionService;
import ar.edu.siglo21.socioclub.service.ReglaNegocioException;
import ar.edu.siglo21.socioclub.service.SocioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/inscripciones")
public class InscripcionController {
    private final InscripcionService inscripcionService;
    private final SocioService socioService;
    private final ActividadService actividadService;

    public InscripcionController(InscripcionService inscripcionService, SocioService socioService,
                                 ActividadService actividadService) {
        this.inscripcionService = inscripcionService;
        this.socioService = socioService;
        this.actividadService = actividadService;
    }

    @GetMapping("/nueva")
    public String nueva(Model model) {
        cargarOpciones(model);
        return "inscripciones/formulario";
    }

    @PostMapping
    public String crear(@RequestParam Long socioId, @RequestParam Long actividadId,
                        RedirectAttributes redirectAttributes) {
        try {
            inscripcionService.inscribir(socioId, actividadId);
            redirectAttributes.addFlashAttribute("exito", "La inscripción fue creada correctamente.");
            return "redirect:/actividades/" + actividadId + "/inscriptos";
        } catch (ReglaNegocioException | IllegalArgumentException exception) {
            redirectAttributes.addFlashAttribute("error", exception.getMessage());
            return "redirect:/inscripciones/nueva";
        }
    }

    @PostMapping("/{id}/baja")
    public String darDeBaja(@PathVariable Long id, @RequestParam Long actividadId,
                            RedirectAttributes redirectAttributes) {
        try {
            inscripcionService.darDeBaja(id);
            redirectAttributes.addFlashAttribute("exito", "La inscripción fue dada de baja.");
        } catch (IllegalArgumentException exception) {
            redirectAttributes.addFlashAttribute("error", exception.getMessage());
        }
        return "redirect:/actividades/" + actividadId + "/inscriptos";
    }

    private void cargarOpciones(Model model) {
        model.addAttribute("socios", socioService.listarTodos());
        model.addAttribute("actividades", actividadService.listar());
    }
}
