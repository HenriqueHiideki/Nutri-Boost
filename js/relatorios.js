document.addEventListener('DOMContentLoaded', () => {


  const avatarCores = ['#e08e3e', '#4f8a8a', '#8a63d2', '#4472c4', '#3f7d52', '#d9574f'];

  const pacientesNomes = [
    'Amanda Nunes', 'Letícia Soares', 'Maria Eduarda', 'Carlos Eduardo',
    'Beatriz Lima', 'Rafael Costa', 'Fernanda Alves', 'João Pedro Santos'
  ];

  function iniciais(nome) {
    return nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }
  function corAvatar(nome) {
    const i = pacientesNomes.indexOf(nome);
    return avatarCores[(i >= 0 ? i : 0) % avatarCores.length];
  }
  function paraDataOrdenavel(str) {
    const [d, m, a] = str.split('/');
    return `${a}${m}${d}`;
  }

  const relatorios = [
    { id: 1, paciente: 'Amanda Nunes', tipo: 'Evolução Clínica', periodo: 'Junho/2026', data: '28/06/2026', status: 'concluido' },
    { id: 2, paciente: 'Letícia Soares', tipo: 'Evolução Clínica', periodo: 'Junho/2026', data: '30/06/2026', status: 'concluido' },
    { id: 3, paciente: 'Maria Eduarda', tipo: 'Evolução Clínica', periodo: 'Junho/2026', data: '27/06/2026', status: 'concluido' },
    { id: 4, paciente: 'Carlos Eduardo', tipo: 'Avaliação Antropométrica', periodo: 'Junho/2026', data: '02/06/2026', status: 'pendente' },
    { id: 5, paciente: 'Beatriz Lima', tipo: 'Relatório Final', periodo: 'Março/2026', data: '14/03/2026', status: 'concluido' },
    { id: 6, paciente: 'Rafael Costa', tipo: 'Evolução Clínica', periodo: 'Junho/2026', data: '29/06/2026', status: 'concluido' },
    { id: 7, paciente: 'Fernanda Alves', tipo: 'Avaliação Antropométrica', periodo: 'Janeiro/2026', data: '15/01/2026', status: 'concluido' },
    { id: 8, paciente: 'João Pedro Santos', tipo: 'Evolução Clínica', periodo: 'Maio/2026', data: '18/05/2026', status: 'concluido' },
    { id: 9, paciente: 'Amanda Nunes', tipo: 'Avaliação Antropométrica', periodo: 'Janeiro/2026', data: '02/01/2026', status: 'concluido' },
    { id: 10, paciente: 'Carlos Eduardo', tipo: 'Plano Alimentar', periodo: 'Fevereiro/2026', data: '05/02/2026', status: 'concluido' },
    { id: 11, paciente: 'Maria Eduarda', tipo: 'Retorno de Consulta', periodo: 'Maio/2026', data: '30/05/2026', status: 'pendente' },
    { id: 12, paciente: 'João Pedro Santos', tipo: 'Plano Alimentar', periodo: 'Março/2026', data: '10/03/2026', status: 'concluido' }
  ];

  let buscaAtual = '';
  let filtroTipoAtual = 'todos';
  let filtroStatusAtual = 'todos';
  let paginaAtual = 1;
  const ITENS_POR_PAGINA = 6;

  const tbody = document.getElementById('tabelaRelatoriosBody');
  const emptyEl = document.getElementById('emptyRelatorios');
  const paginacaoEl = document.getElementById('paginacaoRelatorios');

  function renderKPIs() {
    document.getElementById('kpiTotal').textContent = relatorios.length;

    const mesAtual = '06';
    const anoAtual = '2026';
    const gerados = relatorios.filter(r => {
      const [, m, a] = r.data.split('/');
      return m === mesAtual && a === anoAtual;
    }).length;
    document.getElementById('kpiMes').textContent = gerados;

    document.getElementById('kpiPendentes').textContent = relatorios.filter(r => r.status === 'pendente').length;

    const maisRecente = [...relatorios].sort((a, b) => paraDataOrdenavel(b.data).localeCompare(paraDataOrdenavel(a.data)))[0];
    document.getElementById('kpiUltimo').textContent = maisRecente ? maisRecente.data : '—';
  }

  function getListaFiltrada() {
    return relatorios.filter(r => {
      const okBusca = r.paciente.toLowerCase().includes(buscaAtual.toLowerCase()) || r.tipo.toLowerCase().includes(buscaAtual.toLowerCase());
      const okTipo = filtroTipoAtual === 'todos' || r.tipo === filtroTipoAtual;
      const okStatus = filtroStatusAtual === 'todos' || r.status === filtroStatusAtual;
      return okBusca && okTipo && okStatus;
    }).sort((a, b) => paraDataOrdenavel(b.data).localeCompare(paraDataOrdenavel(a.data)));
  }

  function renderTabela() {
    const listaCompleta = getListaFiltrada();
    const totalPaginas = Math.max(1, Math.ceil(listaCompleta.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = listaCompleta.slice(inicio, inicio + ITENS_POR_PAGINA);

    if (lista.length === 0) {
      tbody.innerHTML = '';
      emptyEl.hidden = false;
      renderPaginacao(0, listaCompleta.length);
      return;
    }

    emptyEl.hidden = true;

    tbody.innerHTML = lista.map(r => `
      <tr>
        <td>
          <div class="paciente-cell">
            <div class="avatar-mini" style="background:${corAvatar(r.paciente)}">${iniciais(r.paciente)}</div>
            <span class="nome">${r.paciente}</span>
          </div>
        </td>
        <td class="relatorio-tipo">${r.tipo}</td>
        <td>${r.periodo}</td>
        <td>${r.data}</td>
        <td><span class="status-pill ${r.status}">${r.status === 'concluido' ? 'Concluído' : 'Pendente'}</span></td>
        <td>
          <div class="acoes-cell">
            <button type="button" class="acao-btn" data-visualizar="${r.id}">Visualizar</button>
            <button type="button" class="acao-btn acao-primaria" data-baixar="${r.id}">Baixar</button>
          </div>
        </td>
      </tr>
    `).join('');

    renderPaginacao(totalPaginas, listaCompleta.length);
  }

  function renderPaginacao(totalPaginas, totalItens) {
    if (totalItens === 0) { paginacaoEl.innerHTML = ''; return; }

    let numeros = '';
    for (let i = 1; i <= totalPaginas; i++) {
      numeros += `<button type="button" class="pagina-num ${i === paginaAtual ? 'pagina-ativa' : ''}" data-pagina="${i}">${i}</button>`;
    }

    paginacaoEl.innerHTML = `
      <button type="button" class="pagina-btn" id="paginaAnteriorRel" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>
      <div class="pagina-numeros">${numeros}</div>
      <button type="button" class="pagina-btn" id="paginaProximaRel" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima</button>
    `;

    document.getElementById('paginaAnteriorRel')?.addEventListener('click', () => { paginaAtual--; renderTabela(); });
    document.getElementById('paginaProximaRel')?.addEventListener('click', () => { paginaAtual++; renderTabela(); });
    paginacaoEl.querySelectorAll('.pagina-num').forEach(btn => {
      btn.addEventListener('click', () => { paginaAtual = Number(btn.dataset.pagina); renderTabela(); });
    });
  }

  tbody.addEventListener('click', (e) => {
    const btnVer = e.target.closest('[data-visualizar]');
    const btnBaixar = e.target.closest('[data-baixar]');

    if (btnVer) {
      const r = relatorios.find(rel => rel.id === Number(btnVer.dataset.visualizar));
      alert(`Visualizando: ${r.tipo} — ${r.paciente} (${r.periodo})`);
    }
    if (btnBaixar) {
      const r = relatorios.find(rel => rel.id === Number(btnBaixar.dataset.baixar));
      alert(`Baixando: ${r.tipo} — ${r.paciente} (${r.periodo})`);
    }
  });

  document.getElementById('buscaRelatorioInput').addEventListener('input', (e) => {
    buscaAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  document.getElementById('filtroTipo').addEventListener('change', (e) => {
    filtroTipoAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  document.getElementById('filtroStatusRel').addEventListener('change', (e) => {
    filtroStatusAtual = e.target.value;
    paginaAtual = 1;
    renderTabela();
  });

  const painelGerar = document.getElementById('painelGerar');
  const campoPaciente = document.getElementById('campoPaciente');

  campoPaciente.innerHTML += pacientesNomes.map(nome => `<option value="${nome}">${nome}</option>`).join('');

  document.getElementById('btnAbrirGerar').addEventListener('click', () => {
    painelGerar.classList.add('painel-aberto');
    painelGerar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('btnFecharGerar').addEventListener('click', () => {
    painelGerar.classList.remove('painel-aberto');
  });

  document.getElementById('formGerar').addEventListener('submit', (e) => {
    e.preventDefault();
    const paciente = campoPaciente.value;
    const tipo = document.getElementById('campoTipo').value;
    const periodoInput = document.getElementById('campoPeriodo').value;

    if (!paciente || !periodoInput) return;

    const [ano, mes] = periodoInput.split('-');
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const periodoLabel = `${meses[Number(mes) - 1]}/${ano}`;
    const hoje = new Date();
    const dataLabel = `${String(hoje.getDate()).padStart(2,'0')}/${String(hoje.getMonth()+1).padStart(2,'0')}/${hoje.getFullYear()}`;

    relatorios.unshift({
      id: relatorios.length + 1,
      paciente, tipo, periodo: periodoLabel, data: dataLabel, status: 'concluido'
    });

    painelGerar.classList.remove('painel-aberto');
    e.target.reset();
    paginaAtual = 1;
    renderKPIs();
    renderTabela();
  });
  
  renderKPIs();
  renderTabela();
});