document.addEventListener('DOMContentLoaded', () => {

 
  const statusInfo = {
    ativo: { label: 'Ativo', classe: 'status-ativo', cor: '#3f7d52' },
    acompanhamento: { label: 'Em Acompanhamento', classe: 'status-acompanhamento', cor: '#4f8a8a' },
    aguardando: { label: 'Aguardando Retorno', classe: 'status-aguardando', cor: '#dcb23e' },
    inativo: { label: 'Inativo', classe: 'status-inativo', cor: '#9aa5a0' }
  };

  const objInfo = {
    emagrecimento: { label: 'Emagrecimento', classe: 'status-obj-emagrecimento' },
    massa: { label: 'Ganho de Massa Magra', classe: 'status-obj-massa' },
    definicao: { label: 'Definição', classe: 'status-obj-definicao' }
  };

  const avatarCores = ['#e08e3e', '#4f8a8a', '#8a63d2', '#4472c4', '#3f7d52', '#d9574f'];

  const pacientes = [
    { id: 1, nome: 'Amanda Nunes', idade: 29, status: 'ativo', objetivo: 'emagrecimento', ultimaVisita: '28/06/2026',
      gordura: 24, massaMagra: 76, pesoAtual: 69, pesoInicial: 78,
      historico: [{m:'Jan',p:78},{m:'Fev',p:76},{m:'Mar',p:74},{m:'Abr',p:72},{m:'Mai',p:70},{m:'Jun',p:69}],
      dieta: [['','Café da manhã','Ovos mexidos, abacate, pão integral',420],['','Almoço','Frango grelhado, arroz integral, brócolis',610],['','Lanche','Iogurte natural com granola e frutas vermelhas',260],['','Jantar','Salmão, batata doce, salada verde',540]],
      observacoes: [['25/06/2026','Paciente relatou melhora na disposição. Manter plano atual.'],['10/06/2026','Reduzir consumo de sódio devido à leve retenção de líquidos.']],
      relatorios: [['Relatório de Evolução - Junho/2026','28/06/2026'],['Avaliação Antropométrica Inicial','02/01/2026']] },

    { id: 2, nome: 'Letícia Soares', idade: 34, status: 'acompanhamento', objetivo: 'definicao', ultimaVisita: '30/06/2026',
      gordura: 20, massaMagra: 80, pesoAtual: 59, pesoInicial: 64,
      historico: [{m:'Jan',p:64},{m:'Fev',p:63},{m:'Mar',p:62},{m:'Abr',p:61},{m:'Mai',p:60},{m:'Jun',p:59}],
      dieta: [['','Café da manhã','Omelete de claras, aveia, banana',380],['','Almoço','Tilápia, quinoa, legumes no vapor',520],['','Lanche','Whey protein, castanhas',220],['','Jantar','Omelete, salada, azeite extra virgem',400]],
      observacoes: [['29/06/2026','Ótima adesão ao plano de treino combinado com a dieta.']],
      relatorios: [['Relatório de Evolução - Junho/2026','30/06/2026']] },

    { id: 3, nome: 'Maria Eduarda', idade: 41, status: 'ativo', objetivo: 'massa', ultimaVisita: '27/06/2026',
      gordura: 22, massaMagra: 78, pesoAtual: 63, pesoInicial: 58,
      historico: [{m:'Jan',p:58},{m:'Fev',p:59},{m:'Mar',p:60},{m:'Abr',p:61},{m:'Mai',p:62},{m:'Jun',p:63}],
      dieta: [['','Café da manhã','Pão integral, ovos, pasta de amendoim',520],['','Almoço','Carne magra, arroz, feijão, legumes',700],['','Lanche','Shake proteico, aveia, frutas',380],['','Jantar','Frango, batata doce, vegetais',580]],
      observacoes: [['26/06/2026','Ganho de massa dentro do esperado, ajustar carga calórica em +150kcal.']],
      relatorios: [['Relatório de Evolução - Junho/2026','27/06/2026']] },

    { id: 4, nome: 'Carlos Eduardo', idade: 52, status: 'aguardando', objetivo: 'emagrecimento', ultimaVisita: '02/06/2026',
      gordura: 29, massaMagra: 71, pesoAtual: 87, pesoInicial: 95,
      historico: [{m:'Jan',p:95},{m:'Fev',p:93},{m:'Mar',p:91},{m:'Abr',p:89},{m:'Mai',p:88},{m:'Jun',p:87}],
      dieta: [['','Café da manhã','Tapioca, ovos, café sem açúcar',400],['','Almoço','Peito de frango, arroz integral, salada',600],['','Lanche','Fruta e castanhas',200],['','Jantar','Sopa de legumes com proteína magra',420]],
      observacoes: [['02/06/2026','Aguardando exames de sangue para reavaliação do plano.']],
      relatorios: [['Avaliação Antropométrica','02/06/2026']] },

    { id: 5, nome: 'Beatriz Lima', idade: 26, status: 'inativo', objetivo: 'definicao', ultimaVisita: '14/03/2026',
      gordura: 25, massaMagra: 75, pesoAtual: 65, pesoInicial: 66,
      historico: [{m:'Jan',p:66},{m:'Fev',p:65},{m:'Mar',p:65}],
      dieta: [['','Café da manhã','Vitamina de frutas com aveia',350],['','Almoço','Peixe grelhado, arroz, legumes',540],['','Lanche','Iogurte com mel',180],['','Jantar','Salada completa com frango desfiado',410]],
      observacoes: [['14/03/2026','Paciente pausou acompanhamento por motivos pessoais.']],
      relatorios: [['Relatório Final','14/03/2026']] },

    { id: 6, nome: 'Rafael Costa', idade: 38, status: 'acompanhamento', objetivo: 'massa', ultimaVisita: '29/06/2026',
      gordura: 16, massaMagra: 84, pesoAtual: 76, pesoInicial: 70,
      historico: [{m:'Jan',p:70},{m:'Fev',p:71},{m:'Mar',p:72},{m:'Abr',p:74},{m:'Mai',p:75},{m:'Jun',p:76}],
      dieta: [['','Café da manhã','Panqueca de aveia, ovos, frutas',600],['','Almoço','Carne vermelha magra, arroz, batata doce',780],['','Lanche','Whey, pasta de amendoim, banana',420],['','Jantar','Frango, macarrão integral, legumes',650]],
      observacoes: [['28/06/2026','Evolução excelente de massa magra, manter estratégia atual.']],
      relatorios: [['Relatório de Evolução - Junho/2026','29/06/2026']] },

    { id: 7, nome: 'Fernanda Alves', idade: 31, status: 'ativo', objetivo: 'definicao', ultimaVisita: '01/07/2026',
      gordura: 21, massaMagra: 79, pesoAtual: 61, pesoInicial: 66,
      historico: [{m:'Jan',p:66},{m:'Fev',p:65},{m:'Mar',p:64},{m:'Abr',p:63},{m:'Mai',p:62},{m:'Jun',p:61}],
      dieta: [['','Café da manhã','Iogurte grego, aveia, morango',360],['','Almoço','Frango, quinoa, salada colorida',560],['','Lanche','Castanhas e maçã',210],['','Jantar','Omelete de legumes',380]],
      observacoes: [['01/07/2026','Início da fase de definição, ajustado treino de força.']],
      relatorios: [['Avaliação Antropométrica Inicial','15/01/2026']] },

    { id: 8, nome: 'João Pedro Santos', idade: 45, status: 'aguardando', objetivo: 'massa', ultimaVisita: '18/05/2026',
      gordura: 18, massaMagra: 82, pesoAtual: 80, pesoInicial: 74,
      historico: [{m:'Jan',p:74},{m:'Fev',p:76},{m:'Mar',p:77},{m:'Abr',p:79},{m:'Mai',p:80}],
      dieta: [['','Café da manhã','Panqueca proteica, banana',580],['','Almoço','Carne, arroz, feijão, legumes',750],['','Lanche','Whey, aveia',400],['','Jantar','Frango, batata doce',600]],
      observacoes: [['18/05/2026','Paciente viajou, retorno reagendado para julho.']],
      relatorios: [['Relatório de Evolução - Maio/2026','18/05/2026']] }
  ];

  let filtroAtual = 'todos';
  let buscaAtual = '';
  let ordenacaoAtual = 'nome';
  let visualizacaoAtual = 'grade';
  let paginaAtual = 1;
  const ITENS_POR_PAGINA = 6;

  const grid = document.getElementById('pacientesGrid');
  const paginacaoEl = document.getElementById('paginacao');

  function iniciais(nome) {
    return nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }
  function corAvatar(id) {
    return avatarCores[id % avatarCores.length];
  }
  function paraDataOrdenavel(str) {
    const [d, m, a] = str.split('/');
    return `${a}${m}${d}`;
  }

  /* ---------- RESUMO ---------- */
  function renderResumo() {
    document.getElementById('resumoTotal').textContent = pacientes.length;
    document.getElementById('resumoAtivos').textContent = pacientes.filter(p => p.status === 'ativo' || p.status === 'acompanhamento').length;
    document.getElementById('resumoAguardando').textContent = pacientes.filter(p => p.status === 'aguardando').length;
    document.getElementById('resumoInativos').textContent = pacientes.filter(p => p.status === 'inativo').length;
  }

  /* ---------- FILTRO + BUSCA + ORDENAÇÃO ---------- */
  function getListaFiltrada() {
    let lista = pacientes.filter(p => {
      const okFiltro = filtroAtual === 'todos' || p.status === filtroAtual;
      const okBusca = p.nome.toLowerCase().includes(buscaAtual.toLowerCase());
      return okFiltro && okBusca;
    });

    lista.sort((a, b) => {
      if (ordenacaoAtual === 'nome') return a.nome.localeCompare(b.nome);
      if (ordenacaoAtual === 'visita') return paraDataOrdenavel(b.ultimaVisita).localeCompare(paraDataOrdenavel(a.ultimaVisita));
      if (ordenacaoAtual === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return lista;
  }

  /* ---------- RENDER GRID ---------- */
  function renderPacientes() {
    const listaCompleta = getListaFiltrada();
    const totalPaginas = Math.max(1, Math.ceil(listaCompleta.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = listaCompleta.slice(inicio, inicio + ITENS_POR_PAGINA);

    grid.classList.toggle('visualizacao-lista', visualizacaoAtual === 'lista');

    if (lista.length === 0) {
      grid.innerHTML = `<div class="empty-pacientes">Nenhum paciente encontrado para esse filtro ou busca.</div>`;
      renderPaginacao(0, listaCompleta.length);
      return;
    }

    grid.innerHTML = lista.map(p => `
      <div class="paciente-card">
        <div class="paciente-card-top">
          <div class="avatar-mini" style="width:46px;height:46px;font-size:15px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;background:${corAvatar(p.id)}">${iniciais(p.nome)}</div>
          <div>
            <p class="paciente-nome">${p.nome}</p>
            <p class="paciente-info">${p.idade} anos · Última visita ${p.ultimaVisita}</p>
          </div>
        </div>
        <div class="paciente-status">
          <span class="status ${statusInfo[p.status].classe}">${statusInfo[p.status].label}</span>
          <span class="status ${objInfo[p.objetivo].classe}">${objInfo[p.objetivo].label}</span>
        </div>
        <div class="composicao-mini">
          <div style="width:52px;height:52px;border-radius:50%;flex-shrink:0;background:conic-gradient(var(--laranja) 0% ${p.gordura}%, var(--tertiary-bg-color) ${p.gordura}% 100%);display:flex;align-items:center;justify-content:center;">
            <div style="width:30px;height:30px;background:var(--primary-bg-color);border-radius:50%;"></div>
          </div>
          <div class="comp-legend">
            <span><span class="dot-legend" style="background:var(--laranja)"></span>Gordura: ${p.gordura}%</span>
            <span><span class="dot-legend" style="background:var(--azul-obj)"></span>Massa magra: ${p.massaMagra}%</span>
          </div>
        </div>
        <div class="paciente-card-actions">
          <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="dieta"> Dieta</button>
          <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="peso"> Peso</button>
          <button type="button" class="mini-action" data-abrir-ficha="${p.id}" data-aba="rel"> Relatório</button>
        </div>
      </div>
    `).join('');

    renderPaginacao(totalPaginas, listaCompleta.length);
  }

  /* ---------- PAGINAÇÃO ---------- */
  function renderPaginacao(totalPaginas, totalItens) {
    if (totalItens === 0) { paginacaoEl.innerHTML = ''; return; }

    let numeros = '';
    for (let i = 1; i <= totalPaginas; i++) {
      numeros += `<button type="button" class="pagina-num ${i === paginaAtual ? 'pagina-ativa' : ''}" data-pagina="${i}">${i}</button>`;
    }

    paginacaoEl.innerHTML = `
      <button type="button" class="pagina-btn" id="paginaAnterior" ${paginaAtual === 1 ? 'disabled' : ''}>‹ Anterior</button>
      <div class="pagina-numeros">${numeros}</div>
      <button type="button" class="pagina-btn" id="paginaProxima" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima ›</button>
    `;

    document.getElementById('paginaAnterior')?.addEventListener('click', () => { paginaAtual--; renderPacientes(); scrollParaTopo(); });
    document.getElementById('paginaProxima')?.addEventListener('click', () => { paginaAtual++; renderPacientes(); scrollParaTopo(); });
    paginacaoEl.querySelectorAll('.pagina-num').forEach(btn => {
      btn.addEventListener('click', () => { paginaAtual = Number(btn.dataset.pagina); renderPacientes(); scrollParaTopo(); });
    });
  }

  function scrollParaTopo() {
    document.querySelector('.pacientes-toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- FICHA DE DETALHE ---------- */
  const fichaDetalhe = document.getElementById('fichaDetalhe');

  function abrirFicha(id, aba) {
    const p = pacientes.find(pac => pac.id === id);
    if (!p) return;

    document.getElementById('fichaAvatar').style.background = corAvatar(p.id);
    document.getElementById('fichaAvatar').textContent = iniciais(p.nome);
    document.getElementById('fichaNome').textContent = p.nome;
    document.getElementById('fichaMeta').textContent = `${p.idade} anos · ${statusInfo[p.status].label} · Objetivo: ${objInfo[p.objetivo].label} · Última visita ${p.ultimaVisita}`;

    document.getElementById('fichaDietaBody').innerHTML = p.dieta.map(([icone, nome, itens, kcal]) => `
      <tr>
        <td><span class="refeicao-icon">${icone}</span><span class="refeicao-nome">${nome}</span></td>
        <td>${itens}</td>
        <td><span class="kcal-tag">${kcal} kcal</span></td>
      </tr>`).join('');

    document.getElementById('fichaPesoStats').innerHTML = `
      <div class="peso-stat"><div class="num">${p.pesoAtual} kg</div><div class="lbl">PESO ATUAL</div></div>
      <div class="peso-stat"><div class="num">${p.gordura}%</div><div class="lbl">% GORDURA</div></div>
      <div class="peso-stat"><div class="num">${p.massaMagra}%</div><div class="lbl">% MASSA MAGRA</div></div>
      <div class="peso-stat"><div class="num">${(p.pesoAtual - p.pesoInicial >= 0 ? '+' : '')}${(p.pesoAtual - p.pesoInicial).toFixed(1)} kg</div><div class="lbl">DESDE O INÍCIO</div></div>
    `;

    const maiorPeso = Math.max(...p.historico.map(h => h.p));
    document.getElementById('fichaPesoBarras').innerHTML = p.historico.map(h => `
      <div class="col">
        <div class="b" style="height:${(h.p / maiorPeso) * 100}%"></div>
        <span>${h.m} · ${h.p}kg</span>
      </div>`).join('');

    document.getElementById('fichaObsList').innerHTML = p.observacoes.map(([data, texto]) => `
      <div class="obs-item"><div class="obs-date">${data}</div><div>${texto}</div></div>`).join('');

    document.getElementById('fichaRelList').innerHTML = p.relatorios.map(([nome, data]) => `
      <div class="relatorio-item">
        <div class="relatorio-icon">📄</div>
        <div><div class="relatorio-nome">${nome}</div><div class="relatorio-data">${data}</div></div>
        <button type="button" class="btn-baixar" data-baixar="${nome}">Baixar</button>
      </div>`).join('');

    const abaMap = { dieta: 'tab-dieta', peso: 'tab-peso', obs: 'tab-obs', rel: 'tab-rel' };
    const radioAlvo = document.getElementById(abaMap[aba] || 'tab-dieta');
    if (radioAlvo) radioAlvo.checked = true;

    fichaDetalhe.classList.add('ficha-aberta');
    fichaDetalhe.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('fichaFechar').addEventListener('click', () => {
    fichaDetalhe.classList.remove('ficha-aberta');
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-abrir-ficha]');
    if (!btn) return;
    abrirFicha(Number(btn.dataset.abrirFicha), btn.dataset.aba);
  });

  document.getElementById('fichaRelList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-baixar]');
    if (!btn) return;
    alert(`Baixando: ${btn.dataset.baixar}`);
  });

  /* ---------- EVENTOS DA TOOLBAR ---------- */
  document.getElementById('filtroStatus').addEventListener('click', (e) => {
    const btn = e.target.closest('.filtro-btn');
    if (!btn) return;
    document.querySelectorAll('#filtroStatus .filtro-btn').forEach(b => b.classList.remove('ativo-filtro'));
    btn.classList.add('ativo-filtro');
    filtroAtual = btn.dataset.status;
    paginaAtual = 1;
    renderPacientes();
  });

  document.getElementById('buscaPacienteInput').addEventListener('input', (e) => {
    buscaAtual = e.target.value;
    paginaAtual = 1;
    renderPacientes();
  });

  document.getElementById('ordenarPor').addEventListener('change', (e) => {
    ordenacaoAtual = e.target.value;
    renderPacientes();
  });

  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('ativo-toggle'));
      btn.classList.add('ativo-toggle');
      visualizacaoAtual = btn.dataset.view;
      renderPacientes();
    });
  });

  document.querySelector('.btn-novo-paciente').addEventListener('click', () => {
    alert('Aqui você redirecionaria para a tela de Cadastro de Pacientes.');
  });

  /* ---------- INIT ---------- */
  renderResumo();
  renderPacientes();
});