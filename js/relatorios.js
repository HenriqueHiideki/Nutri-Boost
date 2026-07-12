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

  function formatarData(dataISO) {
    if (!dataISO) return "—";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  const avatarCores = ["#e08e3e", "#4f8a8a", "#8a63d2", "#4472c4", "#3f7d52", "#d9574f"];

  function iniciais(nome) {
    return nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  function corAvatar(id) {
    return avatarCores[id % avatarCores.length];
  }

  let relatorios = [];
  let pacientesDisponiveis = [];

  let buscaAtual = "";
  let filtroTipoAtual = "todos";
  let filtroStatusAtual = "todos";
  let paginaAtual = 1;
  const ITENS_POR_PAGINA = 6;

  const tbody = document.getElementById("tabelaRelatoriosBody");
  const emptyEl = document.getElementById("emptyRelatorios");
  const paginacaoEl = document.getElementById("paginacaoRelatorios");

  async function carregarRelatorios() {
    try {
      const resposta = await fetchAutenticado(`${API_URL}/relatorios`);
      if (!resposta.ok) throw new Error("Erro ao buscar relatórios");

      relatorios = await resposta.json();

      renderKPIs();
      renderTabela();
    } catch (erro) {
      console.error("Erro ao carregar relatórios:", erro);
      tbody.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = "Não foi possível carregar os relatórios. Verifique sua conexão.";
    }
  }

  async function carregarPacientesParaSelect() {
    try {
      const resposta = await fetchAutenticado(`${API_URL}/pacientes`);
      if (!resposta.ok) throw new Error("Erro ao buscar pacientes");

      pacientesDisponiveis = await resposta.json();

      const campoPaciente = document.getElementById("campoPaciente");
      campoPaciente.innerHTML =
        '<option value="" disabled selected>Selecione um paciente</option>' +
        pacientesDisponiveis
          .map((p) => `<option value="${p.id}">${p.nome}</option>`)
          .join("");
    } catch (erro) {
      console.error("Erro ao carregar pacientes para o formulário:", erro);
    }
  }

  function renderKPIs() {
    document.getElementById("kpiTotal").textContent = relatorios.length;

    const hoje = new Date();
    const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, "0");
    const anoAtual = String(hoje.getUTCFullYear());

    const gerados = relatorios.filter((r) => {
      const data = new Date(r.criado_em);
      const m = String(data.getUTCMonth() + 1).padStart(2, "0");
      const a = String(data.getUTCFullYear());
      return m === mesAtual && a === anoAtual;
    }).length;
    document.getElementById("kpiMes").textContent = gerados;

    document.getElementById("kpiPendentes").textContent = relatorios.filter(
      (r) => r.status === "pendente",
    ).length;

    const maisRecente = relatorios[0];
    document.getElementById("kpiUltimo").textContent = maisRecente
      ? formatarData(maisRecente.criado_em)
      : "—";
  }

  function getListaFiltrada() {
    return relatorios.filter((r) => {
      const termo = buscaAtual.toLowerCase();
      const okBusca =
        r.paciente_nome.toLowerCase().includes(termo) ||
        r.tipo.toLowerCase().includes(termo);
      const okTipo = filtroTipoAtual === "todos" || r.tipo === filtroTipoAtual;
      const okStatus = filtroStatusAtual === "todos" || r.status === filtroStatusAtual;
      return okBusca && okTipo && okStatus;
    });
  }

  function renderTabela() {
    const listaCompleta = getListaFiltrada();
    const totalPaginas = Math.max(1, Math.ceil(listaCompleta.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = listaCompleta.slice(inicio, inicio + ITENS_POR_PAGINA);

    if (lista.length === 0) {
      tbody.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = "Nenhum relatório encontrado para esse filtro.";
      renderPaginacao(0, listaCompleta.length);
      return;
    }

    emptyEl.hidden = true;

    tbody.innerHTML = lista
      .map(
        (r) => `
      <tr>
        <td>
          <div class="paciente-cell">
            <div class="avatar-mini" style="background:${corAvatar(r.paciente_id)}">${iniciais(r.paciente_nome)}</div>
            <span class="nome">${r.paciente_nome}</span>
          </div>
        </td>
        <td class="relatorio-tipo">${r.tipo}</td>
        <td>${r.periodo || "—"}</td>
        <td>${formatarData(r.criado_em)}</td>
        <td><span class="status-pill ${r.status}">${r.status === "concluido" ? "Concluído" : "Pendente"}</span></td>
        <td>
          <div class="acoes-cell">
            <button type="button" class="acao-btn" data-visualizar="${r.id}">Visualizar</button>
            <button type="button" class="acao-btn acao-primaria" data-baixar="${r.id}">Baixar</button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");

    renderPaginacao(totalPaginas, listaCompleta.length);
  }

  function renderPaginacao(totalPaginas, totalItens) {
    if (totalItens === 0) {
      paginacaoEl.innerHTML = "";
      return;
    }

    let numeros = "";
    for (let i = 1; i <= totalPaginas; i++) {
      numeros += `<button type="button" class="pagina-num ${i === paginaAtual ? "pagina-ativa" : ""}" data-pagina="${i}">${i}</button>`;
    }

    paginacaoEl.innerHTML = `
      <button type="button" class="pagina-btn" id="paginaAnteriorRel" ${paginaAtual === 1 ? "disabled" : ""}>Anterior</button>
      <div class="pagina-numeros">${numeros}</div>
      <button type="button" class="pagina-btn" id="paginaProximaRel" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima</button>
    `;

    document.getElementById("paginaAnteriorRel")?.addEventListener("click", () => {
      paginaAtual--;
      renderTabela();
    });
    document.getElementById("paginaProximaRel")?.addEventListener("click", () => {
      paginaAtual++;
      renderTabela();
    });
    paginacaoEl.querySelectorAll(".pagina-num").forEach((btn) => {
      btn.addEventListener("click", () => {
        paginaAtual = Number(btn.dataset.pagina);
        renderTabela();
      });
    });
  }

  tbody.addEventListener("click", (e) => {
    const btnVer = e.target.closest("[data-visualizar]");
    const btnBaixar = e.target.closest("[data-baixar]");

    if (btnVer) {
      const r = relatorios.find((rel) => rel.id === Number(btnVer.dataset.visualizar));
      alert(`Visualizando: ${r.tipo} — ${r.paciente_nome} (${r.periodo || "sem período"})`);
    }
    if (btnBaixar) {
      const r = relatorios.find((rel) => rel.id === Number(btnBaixar.dataset.baixar));
      alert(`Baixando: ${r.tipo} — ${r.paciente_nome} (${r.periodo || "sem período"})`);
    }
  });

  document.getElementById("buscaRelatorioInput").addEventListener("input", (e) => {
    buscaAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  document.getElementById("filtroTipo").addEventListener("change", (e) => {
    filtroTipoAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  document.getElementById("filtroStatusRel").addEventListener("change", (e) => {
    filtroStatusAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  const painelGerar = document.getElementById("painelGerar");

  document.getElementById("btnAbrirGerar").addEventListener("click", () => {
    painelGerar.classList.add("painel-aberto");
    painelGerar.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("btnFecharGerar").addEventListener("click", () => {
    painelGerar.classList.remove("painel-aberto");
  });

  document.getElementById("formGerar").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pacienteId = document.getElementById("campoPaciente").value;
    const tipo = document.getElementById("campoTipo").value;
    const periodoInput = document.getElementById("campoPeriodo").value;

    if (!pacienteId || !periodoInput) return;

    const [ano, mes] = periodoInput.split("-");
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const periodoLabel = `${meses[Number(mes) - 1]}/${ano}`;

    try {
      const resposta = await fetchAutenticado(`${API_URL}/pacientes/${pacienteId}/relatorios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, periodo: periodoLabel }),
      });

      if (!resposta.ok) throw new Error("Erro ao gerar relatório");

      painelGerar.classList.remove("painel-aberto");
      e.target.reset();
      paginaAtual = 1;

      await carregarRelatorios();
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível gerar o relatório.");
    }
  });

  carregarRelatorios();
  carregarPacientesParaSelect();
});