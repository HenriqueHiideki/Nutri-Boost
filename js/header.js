document.addEventListener("DOMContentLoaded", () => {
  const nutricionista = JSON.parse(localStorage.getItem("nutriboost_nutricionista") || "null");

  if (!nutricionista || !nutricionista.nome) return;

  const primeiroNome = nutricionista.nome.split(" ")[0];

  const headerNomeEl = document.getElementById("headerNutricionistaNome");
  if (headerNomeEl) {
    headerNomeEl.textContent = `Dra. ${nutricionista.nome}`;
  }

  const boasVindasEl = document.getElementById("dashboardBoasVindas");
  if (boasVindasEl) {
    boasVindasEl.textContent = `Bem-vinda, Dra. ${nutricionista.nome}!`;
  }
});

function atualizarNomeNoHeader() {
  const nutricionista = JSON.parse(localStorage.getItem("nutriboost_nutricionista") || "null");

  if (!nutricionista || !nutricionista.nome) return;

  const headerNomeEl = document.getElementById("headerNutricionistaNome");
  if (headerNomeEl) {
    headerNomeEl.textContent = `Dra. ${nutricionista.nome}`;
  }

  const boasVindasEl = document.getElementById("dashboardBoasVindas");
  if (boasVindasEl) {
    boasVindasEl.textContent = `Bem-vinda, Dra. ${nutricionista.nome}!`;
  }
}

document.addEventListener("DOMContentLoaded", atualizarNomeNoHeader);