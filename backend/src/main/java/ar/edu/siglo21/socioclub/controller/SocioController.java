package ar.edu.siglo21.socioclub.controller;

import ar.edu.siglo21.socioclub.model.EstadoCuota;
import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.service.SocioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/socios")
public class SocioController {
    private static final int TAMANIO_PAGINA = 10;
    private final SocioService socioService;

    public SocioController(SocioService socioService) {
        this.socioService = socioService;
    }

    @GetMapping
    public String listar(@RequestParam(defaultValue = "") String apellido,
                         @RequestParam(defaultValue = "0") int pagina, Model model) {
        Pageable pageable = PageRequest.of(Math.max(0, pagina), TAMANIO_PAGINA,
                Sort.by("apellido").ascending().and(Sort.by("nombre").ascending()));
        model.addAttribute("paginaSocios", socioService.listar(apellido, pageable));
        model.addAttribute("apellido", apellido);
        return "socios/lista";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {
        prepararFormulario(model, new Socio(), "Nuevo socio");
        return "socios/formulario";
    }

    @PostMapping("/nuevo")
    public String crear(@Valid @ModelAttribute("socio") Socio socio, BindingResult result,
                        Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            prepararFormulario(model, socio, "Nuevo socio");
            return "socios/formulario";
        }
        try {
            socioService.guardar(socio);
            redirectAttributes.addFlashAttribute("exito", "El socio fue creado correctamente.");
            return "redirect:/socios";
        } catch (IllegalArgumentException exception) {
            model.addAttribute("error", exception.getMessage());
            prepararFormulario(model, socio, "Nuevo socio");
            return "socios/formulario";
        }
    }

    @GetMapping("/{id}/editar")
    public String editar(@PathVariable Long id, Model model) {
        prepararFormulario(model, socioService.buscarPorId(id), "Editar socio");
        return "socios/formulario";
    }

    @PostMapping("/{id}/editar")
    public String actualizar(@PathVariable Long id, @Valid @ModelAttribute("socio") Socio socio,
                             BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        socio.setId(id);
        if (result.hasErrors()) {
            prepararFormulario(model, socio, "Editar socio");
            return "socios/formulario";
        }
        try {
            socioService.guardar(socio);
            redirectAttributes.addFlashAttribute("exito", "El socio fue actualizado correctamente.");
            return "redirect:/socios";
        } catch (IllegalArgumentException exception) {
            model.addAttribute("error", exception.getMessage());
            prepararFormulario(model, socio, "Editar socio");
            return "socios/formulario";
        }
    }

    private void prepararFormulario(Model model, Socio socio, String titulo) {
        model.addAttribute("socio", socio);
        model.addAttribute("titulo", titulo);
        model.addAttribute("estadosCuota", EstadoCuota.values());
    }
}
