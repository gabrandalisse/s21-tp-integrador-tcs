// Año actual en el pie de página
function setFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Botón "Volver" con el objeto history del navegador (Lectura 4).
// Si se entró directo a la página no hay historial: usamos location para ir al catálogo.
function setupBackButton() {
  const backButton = document.getElementById("back-button");
  if (!backButton) return;

  backButton.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "actividades.html";
    }
  });
}

// Inicia la lógica de la página según los elementos que existan en el DOM
function initPage() {
  setFooterYear();
  setupBackButton();

  if (document.getElementById("catalog")) {
    initCatalog();
  }

  if (document.getElementById("signup-form")) {
    initSignupForm();
  }
}

initPage();
