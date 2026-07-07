document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://nutri-boost.onrender.com";

  const form = document.getElementById("formLogin");
  const erroEl = document.getElementById("loginErro");
  const btnLogin = document.getElementById("btnLogin");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    erroEl.hidden = true;
    btnLogin.disabled = true;
    btnLogin.textContent = "Entrando...";

    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        erroEl.textContent = dados.erro || "Não foi possível entrar.";
        erroEl.hidden = false;
        return;
      }

      localStorage.setItem("nutriboost_token", dados.token);
      localStorage.setItem("nutriboost_nutricionista", JSON.stringify(dados.nutricionista));

      window.location.href = "index.html";

    } catch (erro) {
      console.error(erro);
      erroEl.textContent = "Erro ao conectar com o servidor. Tente novamente.";
      erroEl.hidden = false;
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = "Entrar";
    }
  });
});