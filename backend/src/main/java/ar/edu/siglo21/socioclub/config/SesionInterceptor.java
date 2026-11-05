package ar.edu.siglo21.socioclub.config;

import ar.edu.siglo21.socioclub.controller.LoginController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

// Se ejecuta ANTES de cada controlador del backoffice.
// Si nadie inició sesión, manda al login y corta el pedido.
@Component
public class SesionInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        boolean logueada = session != null && session.getAttribute(LoginController.SESION_SECRETARIA) != null;
        if (!logueada) {
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }
        return true;
    }
}
