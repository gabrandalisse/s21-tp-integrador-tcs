package ar.edu.siglo21.socioclub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Registra el interceptor de sesión solo para las pantallas del backoffice.
// La API (/api/**) no pasa por acá: la app React tiene su propio login.
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final SesionInterceptor sesionInterceptor;

    public WebConfig(SesionInterceptor sesionInterceptor) {
        this.sesionInterceptor = sesionInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sesionInterceptor)
                .addPathPatterns("/", "/actividades/**", "/socios/**", "/inscripciones/**");
    }
}
