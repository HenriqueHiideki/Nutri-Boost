let pacienteAtualId = null;

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

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000";

  const statusInfo = {
    ativo: { label: "Ativo", classe: "status-ativo", cor: "#3f7d52" },
    acompanhamento: {
      label: "Em Acompanhamento",
      classe: "status-acompanhamento",
      cor: "#4f8a8a",
    },
    aguardando: {
      label: "Aguardando Retorno",
      classe: "status-aguardando",
      cor: "#dcb23e",
    },
    inativo: { label: "Inativo", classe: "status-inativo", cor: "#9aa5a0" },
  };

  const objInfo = {
    emagrecimento: {
      label: "Emagrecimento",
      classe: "status-obj-emagrecimento",
    },
    massa: { label: "Ganho de Massa Magra", classe: "status-obj-massa" },
    definicao: { label: "Definição", classe: "status-obj-definicao" },
  };

  const avatarCores = [
    "#e08e3e",
    "#4f8a8a",
    "#8a63d2",
    "#4472c4",
    "#3f7d52",
    "#d9574f",
  ];

  let pacientes = [];

  async function carregarPacientes() {
    try {
      const resposta = await fetchAutenticado(`${API_URL}/pacientes`);
      if (!resposta.ok) throw new Error("Erro ao buscar pacientes");

      pacientes = await resposta.json();

      renderResumo();
      renderPacientes();
    } catch (erro) {
      console.error("Erro ao carregar pacientes:", erro);
      document.getElementById("pacientesGrid").innerHTML =
        '<div class="empty-pacientes">Não foi possível carregar os pacientes. Verifique se o servidor está rodando.</div>';
    }
  }

  let filtroAtual = "todos";
  let buscaAtual = "";
  let ordenacaoAtual = "nome";
  let visualizacaoAtual = "grade";
  let paginaAtual = 1;
  const ITENS_POR_PAGINA = 6;

  const grid = document.getElementById("pacientesGrid");
  const paginacaoEl = document.getElementById("paginacao");
  const fichaDetalhe = document.getElementById("fichaDetalhe");

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
  function formatarData(dataISO) {
    if (!dataISO) return "—";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  function renderResumo() {
    document.getElementById("resumoTotal").textContent = pacientes.length;
    document.getElementById("resumoAtivos").textContent = pacientes.filter(
      (p) => p.status === "ativo" || p.status === "acompanhamento",
    ).length;
    document.getElementById("resumoAguardando").textContent = pacientes.filter(
      (p) => p.status === "aguardando",
    ).length;
    document.getElementById("resumoInativos").textContent = pacientes.filter(
      (p) => p.status === "inativo",
    ).length;
  }

  function getListaFiltrada() {
    let lista = pacientes.filter((p) => {
      const okFiltro = filtroAtual === "todos" || p.status === filtroAtual;
      const okBusca = p.nome.toLowerCase().includes(buscaAtual.toLowerCase());
      return okFiltro && okBusca;
    });

    lista.sort((a, b) => {
      if (ordenacaoAtual === "nome") return a.nome.localeCompare(b.nome);
      if (ordenacaoAtual === "visita") {

        return (b.ultima_visita || "").localeCompare(a.ultima_visita || "");
      }
      if (ordenacaoAtual === "status") return a.status.localeCompare(b.status);
      return 0;
    });

    return lista;
  }

  function renderPacientes() {
    const listaCompleta = getListaFiltrada();
    const totalPaginas = Math.max(
      1,
      Math.ceil(listaCompleta.length / ITENS_POR_PAGINA),
    );
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = listaCompleta.slice(inicio, inicio + ITENS_POR_PAGINA);

    grid.classList.toggle("visualizacao-lista", visualizacaoAtual === "lista");

    if (lista.length === 0) {
      grid.innerHTML = `<div class="empty-pacientes">Nenhum paciente encontrado para esse filtro ou busca.</div>`;
      renderPaginacao(0, listaCompleta.length);
      return;
    }

    grid.innerHTML = lista
      .map(
        (p) => `
  <div class="paciente-card">
    <div class="paciente-card-top">
      <div class="avatar-mini" style="width:46px;height:46px;font-size:15px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;background:${corAvatar(p.id)}">${iniciais(p.nome)}</div>
      <div>
        <p class="paciente-nome">${p.nome}</p>
        <p class="paciente-info">${p.idade} anos · Última visita ${formatarData(p.ultima_visita)}</p>
      </div>
    </div>
    <div class="paciente-status">
      <span class="status ${statusInfo[p.status].classe}">${statusInfo[p.status].label}</span>
      <span class="status ${objInfo[p.objetivo].classe}">${objInfo[p.objetivo].label}</span>
    </div>
    <div class="composicao-mini">
      <div style="width:52px;height:52px;border-radius:50%;flex-shrink:0;background:conic-gradient(var(--laranja) 0% ${p.percentual_gordura ?? 0}%, var(--tertiary-bg-color) ${p.percentual_gordura ?? 0}% 100%);display:flex;align-items:center;justify-content:center;">
        <div style="width:30px;height:30px;background:var(--primary-bg-color);border-radius:50%;"></div>
      </div>
      <div class="comp-legend">
        <span><span class="dot-legend" style="background:var(--laranja)"></span>Gordura: ${p.percentual_gordura ?? "—"}%</span>
        <span><span class="dot-legend" style="background:var(--azul-obj)"></span>Massa magra: ${p.percentual_massa_magra ?? "—"}%</span>
      </div>
    </div>
    <div class="paciente-card-actions">
      <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="dieta">Dieta</button>
      <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="peso">Peso</button>
      <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="rel">Relatório</button>
    </div>
  </div>
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
      <button type="button" class="pagina-btn" id="paginaAnterior" ${paginaAtual === 1 ? "disabled" : ""}>‹ Anterior</button>
      <div class="pagina-numeros">${numeros}</div>
      <button type="button" class="pagina-btn" id="paginaProxima" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima ›</button>
    `;

    document.getElementById("paginaAnterior")?.addEventListener("click", () => {
      paginaAtual--;
      renderPacientes();
      scrollParaTopo();
    });
    document.getElementById("paginaProxima")?.addEventListener("click", () => {
      paginaAtual++;
      renderPacientes();
      scrollParaTopo();
    });
    paginacaoEl.querySelectorAll(".pagina-num").forEach((btn) => {
      btn.addEventListener("click", () => {
        paginaAtual = Number(btn.dataset.pagina);
        renderPacientes();
        scrollParaTopo();
      });
    });
  }

  function scrollParaTopo() {
    document
      .querySelector(".pacientes-toolbar")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function abrirFicha(id, aba) {
    pacienteAtualId = id;
    const p = pacientes.find((pac) => pac.id === id);
    if (!p) return;

    document.getElementById("fichaAvatar").style.background = corAvatar(p.id);
    document.getElementById("fichaAvatar").textContent = iniciais(p.nome);
    document.getElementById("fichaNome").textContent = p.nome;
    document.getElementById("fichaMeta").textContent =
      `${p.idade} anos · ${statusInfo[p.status].label} · Objetivo: ${objInfo[p.objetivo].label} · Última visita ${formatarData(p.ultima_visita)}`;

    document.getElementById("fichaDietaBody").innerHTML =
      '<tr><td colspan="3">Carregando...</td></tr>';
    document.getElementById("fichaPesoStats").innerHTML = "";
    document.getElementById("fichaPesoBarras").innerHTML =
      '<p style="color:var(--texto-suave);font-size:12.5px;">Carregando...</p>';
    document.getElementById("fichaObsList").innerHTML =
      '<p style="color:var(--texto-suave);font-size:12.5px;">Carregando...</p>';
    document.getElementById("fichaRelList").innerHTML =
      '<p style="color:var(--texto-suave);font-size:12.5px;">Carregando...</p>';

    const abaMap = {
      dieta: "tab-dieta",
      peso: "tab-peso",
      obs: "tab-obs",
      rel: "tab-rel",
    };
    const radioAlvo = document.getElementById(abaMap[aba] || "tab-dieta");
    if (radioAlvo) radioAlvo.checked = true;

    fichaDetalhe.classList.add("ficha-aberta");
    fichaDetalhe.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const [dietaRes, obsRes, relRes] = await Promise.all([
        fetchAutenticado(`${API_URL}/pacientes/${id}/dieta`),
        fetchAutenticado(`${API_URL}/pacientes/${id}/observacoes`),
        fetchAutenticado(`${API_URL}/pacientes/${id}/relatorios`),
      ]);

      const dieta = await dietaRes.json();
      const observacoes = await obsRes.json();
      const relatorios = await relRes.json();

      renderFichaDieta(dieta);
      renderFichaObservacoes(id, observacoes);
      renderFichaRelatorios(relatorios);
      await renderFichaPeso(id);
    } catch (erro) {
      console.error("Erro ao carregar dados da ficha:", erro);
    }
  }

  function renderFichaDieta(dieta) {
    if (dieta.length === 0) {
      document.getElementById("fichaDietaBody").innerHTML =
        '<tr><td colspan="3">Nenhuma refeição cadastrada ainda.</td></tr>';
      return;
    }

    document.getElementById("fichaDietaBody").innerHTML = dieta
      .map(
        (r) => `
      <tr>
        <td><span class="refeicao-nome">${r.refeicao}</span></td>
        <td>${r.itens}</td>
        <td><span class="kcal-tag">${r.kcal} kcal</span></td>
      </tr>`,
      )
      .join("");
  }

  function renderFichaObservacoes(pacienteId, observacoes) {
    const lista = document.getElementById("fichaObsList");

    const listaHtml =
      observacoes.length === 0
        ? '<p style="color:var(--texto-suave);font-size:12.5px;">Nenhuma observação registrada ainda.</p>'
        : observacoes
            .map(
              (o) => `
        <div class="obs-item">
          <div class="obs-date">${formatarData(o.criado_em)}</div>
          <div>${o.texto}</div>
        </div>`,
            )
            .join("");

    lista.innerHTML =
      listaHtml +
      `
      <div class="obs-add" style="margin-top:14px;display:flex;gap:8px;">
        <textarea id="novaObsTexto" placeholder="Adicionar nova observação..." style="flex:1;border:1px solid var(--borda);border-radius:10px;padding:10px 12px;font-family:inherit;font-size:12.5px;resize:none;height:44px;"></textarea>
        <button type="button" id="btnSalvarObs" data-paciente="${pacienteId}" style="background:var(--quarternary-bg-color);color:#fff;border:none;border-radius:10px;padding:0 16px;font-weight:700;font-size:12px;cursor:pointer;">Salvar</button>
      </div>`;

    document
      .getElementById("btnSalvarObs")
      .addEventListener("click", salvarNovaObservacao);
  }

  async function salvarNovaObservacao(e) {
    const pacienteId = e.target.dataset.paciente;
    const texto = document.getElementById("novaObsTexto").value.trim();
    if (!texto) return;

    try {
      const resposta = await fetchAutenticado(
        `${API_URL}/pacientes/${pacienteId}/observacoes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto }),
        },
      );
      if (!resposta.ok) throw new Error("Erro ao salvar observação");

      const obsRes = await fetchAutenticado(
        `${API_URL}/pacientes/${pacienteId}/observacoes`,
      );
      const observacoes = await obsRes.json();
      renderFichaObservacoes(pacienteId, observacoes);
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar a observação.");
    }
  }

  function renderFichaRelatorios(relatorios) {
    const lista = document.getElementById("fichaRelList");

    if (relatorios.length === 0) {
      lista.innerHTML =
        '<p style="color:var(--texto-suave);font-size:12.5px;">Nenhum relatório gerado ainda.</p>';
      return;
    }

    lista.innerHTML = relatorios
      .map(
        (r) => `
      <div class="relatorio-item">
        <div class="relatorio-icon">📄</div>
        <div><div class="relatorio-nome">${r.tipo}</div><div class="relatorio-data">${r.periodo} · ${formatarData(r.criado_em)}</div></div>
        <button type="button" class="btn-baixar" data-baixar="${r.tipo}">Baixar</button>
      </div>`,
      )
      .join("");
  }

  async function renderFichaPeso(pacienteId) {
    try {
      const [atualRes, historicoRes] = await Promise.all([
        fetchAutenticado(`${API_URL}/pacientes/${pacienteId}/composicao`),
        fetchAutenticado(
          `${API_URL}/pacientes/${pacienteId}/composicao/historico`,
        ),
      ]);

      if (!atualRes.ok) {
        document.getElementById("fichaPesoStats").innerHTML =
          '<p style="color:var(--texto-suave);font-size:12.5px;grid-column:1/-1;">Nenhuma medição registrada ainda.</p>';
        document.getElementById("fichaPesoBarras").innerHTML = "";
        return;
      }

      const c = await atualRes.json();
      const historico = await historicoRes.json();

      const pesoInicial =
        historico.length > 0 ? Number(historico[0].peso) : Number(c.peso);
      const variacao = Number(c.peso) - pesoInicial;
      const sinal = variacao >= 0 ? "+" : "";

      document.getElementById("fichaPesoStats").innerHTML = `
      <div class="peso-stat"><div class="num">${Number(c.peso).toFixed(1)} kg</div><div class="lbl">PESO ATUAL</div></div>
      <div class="peso-stat"><div class="num">${c.percentual_gordura}%</div><div class="lbl">% GORDURA</div></div>
      <div class="peso-stat"><div class="num">${c.percentual_massa_magra}%</div><div class="lbl">% MASSA MAGRA</div></div>
      <div class="peso-stat"><div class="num">${sinal}${variacao.toFixed(1)} kg</div><div class="lbl">DESDE O INÍCIO</div></div>
    `;

      if (historico.length === 0) {
        document.getElementById("fichaPesoBarras").innerHTML =
          '<p style="color:var(--texto-suave);font-size:12.5px;">Sem histórico suficiente para o gráfico ainda.</p>';
        return;
      }

      const maiorPeso = Math.max(...historico.map((h) => Number(h.peso)));

      document.getElementById("fichaPesoBarras").innerHTML = historico
        .map((h) => {
          const alturaPercentual = (Number(h.peso) / maiorPeso) * 100;
          const mesLabel = new Date(h.data_medicao).toLocaleDateString(
            "pt-BR",
            {
              month: "short",
              timeZone: "UTC",
            },
          );
          return `
        <div class="col">
          <div class="b" style="height:${alturaPercentual}%"></div>
          <span>${mesLabel} · ${Number(h.peso).toFixed(0)}kg</span>
        </div>`;
        })
        .join("");
    } catch (erro) {
      console.error(erro);
    }
  }

  document.getElementById("fichaFechar").addEventListener("click", () => {
    fichaDetalhe.classList.remove("ficha-aberta");
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-abrir-ficha]");
    if (!btn) return;
    abrirFicha(Number(btn.dataset.abrirFicha), btn.dataset.aba);
  });

  document.getElementById("fichaRelList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-baixar]");
    if (!btn) return;
    alert(`Baixando: ${btn.dataset.baixar}`);
  });

  document.getElementById("filtroStatus").addEventListener("click", (e) => {
    const btn = e.target.closest(".filtro-btn");
    if (!btn) return;
    document
      .querySelectorAll("#filtroStatus .filtro-btn")
      .forEach((b) => b.classList.remove("ativo-filtro"));
    btn.classList.add("ativo-filtro");
    filtroAtual = btn.dataset.status;
    paginaAtual = 1;
    renderPacientes();
  });

  document
    .getElementById("buscaPacienteInput")
    .addEventListener("input", (e) => {
      buscaAtual = e.target.value;
      paginaAtual = 1;
      renderPacientes();
    });

  document.getElementById("ordenarPor").addEventListener("change", (e) => {
    ordenacaoAtual = e.target.value;
    renderPacientes();
  });

  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".toggle-btn")
        .forEach((b) => b.classList.remove("ativo-toggle"));
      btn.classList.add("ativo-toggle");
      visualizacaoAtual = btn.dataset.view;
      renderPacientes();
    });
  });

  const painelNovoPaciente = document.getElementById("painelNovoPaciente");

  document
    .getElementById("btnAbrirNovoPaciente")
    .addEventListener("click", () => {
      painelNovoPaciente.classList.add("painel-aberto");
      painelNovoPaciente.scrollIntoView({ behavior: "smooth", block: "start" });
    });

  document
    .getElementById("btnFecharNovoPaciente")
    .addEventListener("click", () => {
      painelNovoPaciente.classList.remove("painel-aberto");
    });

  document
    .getElementById("formNovoPaciente")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const novoPaciente = {
        nome: document.getElementById("novoNome").value.trim(),
        idade: document.getElementById("novaIdade").value || null,
        status: document.getElementById("novoStatus").value,
        objetivo: document.getElementById("novoObjetivo").value,
      };

      try {
        const resposta = await fetchAutenticado(`${API_URL}/pacientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoPaciente),
        });

        if (!resposta.ok) throw new Error("Erro ao cadastrar paciente");

        e.target.reset();
        painelNovoPaciente.classList.remove("painel-aberto");

        await carregarPacientes();
      } catch (erro) {
        console.error(erro);
        alert("Não foi possível cadastrar o paciente.");
      }
    });

  const painelEditarPaciente = document.getElementById("painelEditarPaciente");

  document.getElementById("fichaEditar").addEventListener("click", () => {
    const p = pacientes.find((pac) => pac.id === pacienteAtualId);
    if (!p) return;

    document.getElementById("editarNome").value = p.nome;
    document.getElementById("editarIdade").value = p.idade || "";
    document.getElementById("editarStatus").value = p.status;
    document.getElementById("editarObjetivo").value = p.objetivo;

    painelEditarPaciente.classList.add("painel-aberto");
  });

  document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
    painelEditarPaciente.classList.remove("painel-aberto");
  });

  document
    .getElementById("formEditarPaciente")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const p = pacientes.find((pac) => pac.id === pacienteAtualId);

      const dadosAtualizados = {
        nome: document.getElementById("editarNome").value.trim(),
        idade: document.getElementById("editarIdade").value || null,
        status: document.getElementById("editarStatus").value,
        objetivo: document.getElementById("editarObjetivo").value,
        ultima_visita: p ? p.ultima_visita : null,
      };

      try {
        const resposta = await fetchAutenticado(
          `${API_URL}/pacientes/${pacienteAtualId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
          },
        );

        if (!resposta.ok) throw new Error("Erro ao atualizar paciente");

        painelEditarPaciente.classList.remove("painel-aberto");

        await carregarPacientes();
        abrirFicha(pacienteAtualId, "dieta");
      } catch (erro) {
        console.error(erro);
        alert("Não foi possível atualizar o paciente.");
      }
    });

    document.getElementById("fichaExcluir").addEventListener("click", async () => {
  const p = pacientes.find((pac) => pac.id === pacienteAtualId);
  if (!p) return;

  const confirmou = confirm(
    `Tem certeza que deseja excluir o paciente "${p.nome}"?\n\nEssa ação é permanente e vai apagar também toda a dieta, observações, histórico de peso e relatórios dele. Não é possível desfazer.`
  );

  if (!confirmou) return;

  try {
    const resposta = await fetchAutenticado(`${API_URL}/pacientes/${pacienteAtualId}`, {
      method: "DELETE",
    });

    if (!resposta.ok) throw new Error("Erro ao excluir paciente");

    fichaDetalhe.classList.remove("ficha-aberta");
    await carregarPacientes();

  } catch (erro) {
    console.error(erro);
    alert("Não foi possível excluir o paciente.");
  }
});

  carregarPacientes();
});
