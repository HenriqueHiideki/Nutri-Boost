document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://nutri-boost.onrender.com";

  const form = document.getElementById("formLogin");
  const erroEl = document.getElementById("loginErro");
  const btnLogin = document.getElementById("btnLogin");
  const btnLoginTexto = document.getElementById("btnLoginTexto");

  // Alternar visibilidade da senha
  const toggleSenha = document.getElementById("toggleSenha");
  const campoSenha = document.getElementById("senha");
  const iconeAberto = document.getElementById("iconeOlhoAberto");
  const iconeFechado = document.getElementById("iconeOlhoFechado");

  toggleSenha.addEventListener("click", () => {
    const visivel = campoSenha.type === "text";
    campoSenha.type = visivel ? "password" : "text";
    iconeAberto.hidden = !visivel;
    iconeFechado.hidden = visivel;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("usuario").value.trim();
    const senha = campoSenha.value;

    erroEl.hidden = true;
    btnLogin.disabled = true;
    btnLoginTexto.textContent = "Entrando...";

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
      btnLoginTexto.textContent = "Entrar";
    }
  });
});