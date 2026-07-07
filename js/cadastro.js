document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://nutri-boost.onrender.com";

  const form = document.getElementById("formCadastro");
  const erroEl = document.getElementById("cadastroErro");
  const btnCadastrar = document.getElementById("btnCadastrar");

  document.querySelectorAll(".cadastro-box-patient").forEach((card) => {
    card.addEventListener("click", () => {
      erroEl.textContent = "O cadastro de pacientes ainda não está disponível. Em breve!";
      erroEl.hidden = false;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value;
    const confirmarSenha = document.getElementById("cadastroConfirmarSenha").value;

    erroEl.hidden = true;

    if (senha !== confirmarSenha) {
      erroEl.textContent = "As senhas não coincidem.";
      erroEl.hidden = false;
      return;
    }

    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Cadastrando...";

    try {
      const resposta = await fetch(`${API_URL}/nutricionistas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        erroEl.textContent = dados.erro || "Não foi possível cadastrar.";
        erroEl.hidden = false;
        return;
      }

      alert("Conta criada com sucesso! Faça login para continuar.");
      window.location.href = "login.html";

    } catch (erro) {
      console.error(erro);
      erroEl.textContent = "Erro ao conectar com o servidor. Tente novamente.";
      erroEl.hidden = false;
    } finally {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = "Cadastrar";
    }
  });
});