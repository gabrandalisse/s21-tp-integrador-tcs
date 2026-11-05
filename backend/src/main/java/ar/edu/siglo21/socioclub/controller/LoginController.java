package ar.edu.siglo21.socioclub.controller;

import ar.edu.siglo21.socioclub.service.SecretariaService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// Ingreso y salida del backoffice. Si los datos son correctos se guarda una marca
// en la sesión HTTP; el SesionInterceptor revisa esa marca en cada pantalla.
@Controller
public class LoginController {
    public static final String SESION_SECRETARIA = "secretariaLogueada";

    private final SecretariaService secretariaService;

    public LoginController(SecretariaService secretariaService) {
        this.secretariaService = secretariaService;
    }

    @GetMapping("/login")
    public String formulario() {
        return "login";
    }

    @PostMapping("/login")
    public String ingresar(@RequestParam String dni, @RequestParam String clave, HttpSession session, Model model) {
        if (secretariaService.validar(dni, clave)) {
            session.setAttribute(SESION_SECRETARIA, true);
            return "redirect:/actividades";
        }
        model.addAttribute("error", "DNI o contraseña incorrectos.");
        model.addAttribute("dni", dni);
        return "login";
    }

    @PostMapping("/logout")
    public String salir(HttpSession session) {
        session.invalidate();
        return "redirect:/login?salio";
    }
}
