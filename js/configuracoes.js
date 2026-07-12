document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://nutri-boost.onrender.com";

  function fetchAutenticado(url, opcoes = {}) {
    const token = localStorage.getItem("nutriboost_token");
    return fetch(url, {
      ...opcoes,
      headers: {
        ...(opcoes.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const toast = document.createElement("div");
  toast.className = "config-toast";
  document.body.appendChild(toast);

  function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("toast-visivel");
    setTimeout(() => toast.classList.remove("toast-visivel"), 2600);
  }

  async function carregarPerfil() {
    try {
      const resposta = await fetchAutenticado(`${API_URL}/perfil`);
      if (!resposta.ok) throw new Error("Erro ao buscar perfil");

      const dados = await resposta.json();

      document.getElementById("perfilNome").value = dados.nome || "";
      document.getElementById("perfilEmail").value = dados.email || "";
      document.getElementById("perfilCrn").value = dados.crn || "";
      document.getElementById("perfilTelefone").value = dados.telefone || "";
      document.getElementById("perfilEspecialidade").value = dados.especialidade || "";

      const nutricionistaSalva = JSON.parse(localStorage.getItem("nutriboost_nutricionista") || "{}");
      nutricionistaSalva.nome = dados.nome;
      nutricionistaSalva.email = dados.email;
      localStorage.setItem("nutriboost_nutricionista", JSON.stringify(nutricionistaSalva));

    } catch (erro) {
      console.error("Erro ao carregar perfil:", erro);
      mostrarToast("Não foi possível carregar seus dados de perfil.");
    }
  }

  document.getElementById("formPerfil")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dadosPerfil = {
    nome: document.getElementById("perfilNome").value.trim(),
    email: document.getElementById("perfilEmail").value.trim(),
    crn: document.getElementById("perfilCrn").value.trim(),
    telefone: document.getElementById("perfilTelefone").value.trim(),
    especialidade: document.getElementById("perfilEspecialidade").value.trim(),
  };

  try {
    const resposta = await fetchAutenticado(`${API_URL}/perfil`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPerfil),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarToast(dados.erro || "Não foi possível atualizar o perfil.");
      return;
    }

    const nutricionistaSalva = JSON.parse(localStorage.getItem("nutriboost_nutricionista") || "{}");
    nutricionistaSalva.nome = dados.nome;
    nutricionistaSalva.email = dados.email;
    localStorage.setItem("nutriboost_nutricionista", JSON.stringify(nutricionistaSalva));

    atualizarNomeNoHeader();

    mostrarToast("Perfil atualizado com sucesso.");
  } catch (erro) {
    console.error(erro);
    mostrarToast("Erro ao conectar com o servidor.");
  }
});

  document.getElementById("formSenha")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaAtual = document.getElementById("senhaAtual").value;
    const senhaNova = document.getElementById("senhaNova").value;
    const senhaConfirmar = document.getElementById("senhaConfirmar").value;

    if (senhaNova !== senhaConfirmar) {
      mostrarToast("As senhas não coincidem.");
      return;
    }

    try {
      const resposta = await fetchAutenticado(`${API_URL}/perfil/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha: senhaNova }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        mostrarToast(dados.erro || "Não foi possível atualizar a senha.");
        return;
      }

      e.target.reset();
      mostrarToast("Senha atualizada com sucesso.");
    } catch (erro) {
      console.error(erro);
      mostrarToast("Erro ao conectar com o servidor.");
    }
  });

  document.getElementById("formClinica")?.addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarToast("Dados da clínica salvos localmente (funcionalidade completa em breve).");
  });

  const navItems = document.querySelectorAll(".config-nav-item");
  const secoes = ["perfil", "notificacoes", "seguranca", "clinica"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    let atual = secoes[0];
    secoes.forEach((sec) => {
      if (sec && window.scrollY >= sec.offsetTop - 120) atual = sec;
    });
    navItems.forEach((item) => {
      item.classList.toggle("config-nav-ativo", item.getAttribute("href") === `#${atual?.id}`);
    });
  });

  carregarPerfil();
});