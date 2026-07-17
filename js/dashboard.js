document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://nutri-boost.onrender.com";

  const statusInfo = {
    ativo: { label: "Ativo", cor: "#3f7d52" },
    acompanhamento: { label: "Em Acompanhamento", cor: "#4f8a8a" },
    aguardando: { label: "Aguardando Retorno", cor: "#dcb23e" },
    inativo: { label: "Inativo", cor: "#9aa5a0" },
  };

  const avatarCores = [
    "#e08e3e",
    "#4f8a8a",
    "#8a63d2",
    "#4472c4",
    "#3f7d52",
    "#d9574f",
  ];

  function iniciais(nome) {
    return nome
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function corAvatar(id) {
    return avatarCores[id % avatarCores.length];
  }

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

  async function carregarResumoDashboard() {
    const resumoEl = document.getElementById("dashboardResumoStatus");
    const recentesEl = document.getElementById("dashboardPacientesRecentes");
    const consultasEl = document.getElementById("proximasConsultasList");

    try {
      const resposta = await fetchAutenticado(`${API_URL}/pacientes`);
      if (!resposta.ok) throw new Error("Erro ao buscar pacientes");

      const pacientes = await resposta.json();

      /* ---------- Resumo por status ---------- */
      const total = pacientes.length;
      const ativos = pacientes.filter(
        (p) => p.status === "ativo" || p.status === "acompanhamento",
      ).length;
      const aguardando = pacientes.filter(
        (p) => p.status === "aguardando",
      ).length;
      const inativos = pacientes.filter((p) => p.status === "inativo").length;

      resumoEl.innerHTML = `
      <div class="dashboard-resumo-item">
        <div class="dashboard-resumo-num">${total}</div>
        <div class="dashboard-resumo-lbl">Total de Pacientes</div>
      </div>
      <div class="dashboard-resumo-item item-teal">
        <div class="dashboard-resumo-num">${ativos}</div>
        <div class="dashboard-resumo-lbl">Ativos</div>
      </div>
      <div class="dashboard-resumo-item item-amarelo">
        <div class="dashboard-resumo-num">${aguardando}</div>
        <div class="dashboard-resumo-lbl">Aguardando Retorno</div>
      </div>
      <div class="dashboard-resumo-item item-cinza">
        <div class="dashboard-resumo-num">${inativos}</div>
        <div class="dashboard-resumo-lbl">Inativos</div>
      </div>
    `;

      /* ---------- Pacientes mais recentes ---------- */
      if (pacientes.length === 0) {
        recentesEl.innerHTML = `<div class="dashboard-empty">Nenhum paciente cadastrado ainda. <a href="pacientes.html">Cadastre o primeiro</a>.</div>`;
      } else {
        const recentes = pacientes.slice(0, 4);
        recentesEl.innerHTML = recentes
          .map(
            (p) => `
        <a href="pacientes.html" class="dashboard-paciente-mini">
          <div class="avatar-mini" style="background:${corAvatar(p.id)}">${iniciais(p.nome)}</div>
          <div>
            <p class="nome">${p.nome}</p>
            <p class="status-mini">${statusInfo[p.status]?.label || p.status}</p>
          </div>
        </a>`,
          )
          .join("");
      }

      /* ---------- Próximas Consultas (usa os pacientes ativos/em acompanhamento) ---------- */
      const candidatosConsulta = pacientes.filter(
        (p) => p.status === "ativo" || p.status === "acompanhamento",
      );

      if (candidatosConsulta.length === 0) {
        consultasEl.innerHTML = `<p style="color:var(--texto-suave); font-size:13px; padding: 10px 4px;">Nenhum paciente ativo no momento.</p>`;
      } else {
        const listaConsultas = candidatosConsulta.slice(0, 3);
        consultasEl.innerHTML = listaConsultas
          .map(
            (p) => `
        <div class="card-consultas-container">
          <div class="avatar-mini" style="background:${corAvatar(p.id)}">${iniciais(p.nome)}</div>
          <p class="card-consultas-text">${p.nome} <span>· ${statusInfo[p.status]?.label || p.status}</span></p>
          <a href="pacientes.html" class="card-bt-consultas" style="text-decoration:none; display:inline-flex; align-items:center;">Detalhes</a>
        </div>`,
          )
          .join("");
      }
    } catch (erro) {
      console.error("Erro ao carregar resumo do dashboard:", erro);
      resumoEl.innerHTML = `<p style="color:var(--texto-suave); font-size:13px;">Não foi possível carregar os dados de pacientes.</p>`;
      consultasEl.innerHTML = `<p style="color:var(--texto-suave); font-size:13px; padding: 10px 4px;">Não foi possível carregar.</p>`;
    }
  }

  document.getElementById("btnVerConsultas")?.addEventListener("click", () => {
    alert(
      "A agenda de consultas ainda está em desenvolvimento. Em breve você poderá visualizar todas as consultas por aqui.",
    );
  });

  document
    .getElementById("btnAgendarConsulta")
    ?.addEventListener("click", () => {
      alert(
        "A agenda de consultas ainda está em desenvolvimento. Em breve você poderá agendar consultas por aqui.",
      );
    });

  document.getElementById("btnCriarPlano")?.addEventListener("click", () => {
    window.location.href = "pacientes.html";
  });

  carregarResumoDashboard();
});
