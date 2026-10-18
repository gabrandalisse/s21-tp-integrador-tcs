// Crea el <article> de una tarjeta a partir de un objeto Activity
function createActivityCard(activity) {
  const card = document.createElement("article");
  card.className = "card";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = activity.discipline;

  const title = document.createElement("h3");
  title.textContent = activity.name;

  const details = document.createElement("ul");
  const rows = [
    ["Días", activity.days],
    ["Horario", activity.time + " h"],
    ["Edades", activity.getAgeRange()],
    ["Profe", activity.teacher],
    ["Cupo", activity.capacity + " lugares"],
  ];
  rows.forEach(([label, value]) => {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    item.append(strong, value);
    details.appendChild(item);
  });

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = activity.getFormattedFee() + " / mes";

  // Lleva el nombre de la actividad en la URL para preseleccionarla en el formulario
  const link = document.createElement("a");
  link.className = "btn btn-sm";
  link.href =
    "preinscripcion.html?actividad=" + encodeURIComponent(activity.name);
  link.textContent = "Preinscribirme";

  card.append(tag, title, details, price, link);
  return card;
}

// Dibuja en el contenedor la lista recibida y actualiza el contador
function renderCatalog(container, resultText, list) {
  container.innerHTML = ""; // borra las tarjetas anteriores

  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent =
      "No hay actividades que coincidan con los filtros elegidos.";
    container.appendChild(empty);
  } else {
    list.forEach((activity) =>
      container.appendChild(createActivityCard(activity)),
    );
  }

  resultText.textContent =
    list.length === 1
      ? "Se encontró 1 actividad."
      : `Se encontraron ${list.length} actividades.`;
}

// Punto de entrada de la página: lo llama script.js
function initCatalog() {
  const catalog = document.getElementById("catalog");
  const disciplineFilter = document.getElementById("discipline-filter");
  const ageFilter = document.getElementById("age-filter");
  const clearButton = document.getElementById("clear-filters");
  const filterResult = document.getElementById("filter-result");

  // 1) Cargar las disciplinas en el select
  getDisciplines().forEach((discipline) => {
    const option = document.createElement("option");
    option.value = discipline;
    option.textContent = discipline;
    disciplineFilter.appendChild(option);
  });

  // 2) Leer los filtros, filtrar y volver a dibujar
  function applyFilters() {
    const discipline = disciplineFilter.value;
    const age = parseInt(ageFilter.value, 10);
    renderCatalog(catalog, filterResult, filterActivities(discipline, age));
  }

  // 3) Eventos registrados con addEventListener
  disciplineFilter.addEventListener("change", applyFilters);
  ageFilter.addEventListener("input", applyFilters);
  clearButton.addEventListener("click", () => {
    disciplineFilter.value = "";
    ageFilter.value = "";
    applyFilters();
  });

  // Primer dibujado al cargar la página
  renderCatalog(catalog, filterResult, activities);
}
