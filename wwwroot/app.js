/**
 * Auto Mecânica Precision - Gestão de Ordens de Serviço
 * Lógica do Frontend (Vanilla JavaScript Puro)
 * 
 * Endpoints integrados via caminhos relativos (mesma origem):
 * - GET    /api/ordens       -> Listar registros e atualizar indicadores
 * - GET    /api/ordens/{id}  -> Buscar dados de uma ordem pelo ID
 * - POST   /api/ordens       -> Cadastrar nova ordem
 * - PUT    /api/ordens/{id}  -> Atualizar ordem existente
 * - DELETE /api/ordens/{id}  -> Remover ordem existente
 */

// Endpoint base relativo
const API_URL = "/api/ordens";

// Estado em memória
let listaOrdens = [];
let idParaExcluir = null;
let idEmVisualizacao = null;
let enviandoRequisicao = false;

// Elementos do DOM - Cabeçalho e Métricas
const apiStatusContainer = document.getElementById("api-status-container");
const apiStatusText = document.getElementById("api-status-text");
const metricTotal = document.getElementById("metric-total");
const metricPendentes = document.getElementById("metric-pendentes");
const metricConcluidas = document.getElementById("metric-concluidas");
const metricValorTotal = document.getElementById("metric-valor-total");

// Elementos do DOM - Formulário
const formOrdem = document.getElementById("form-ordem");
const formHeading = document.getElementById("form-heading");
const formModeBadge = document.getElementById("form-mode-badge");
const formFeedback = document.getElementById("form-feedback");
const inputId = document.getElementById("ordem-id");
const inputCliente = document.getElementById("cliente");
const inputVeiculo = document.getElementById("veiculo");
const inputServico = document.getElementById("servico");
const inputValor = document.getElementById("valor");
const selectConcluida = document.getElementById("concluida");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");
const btnLimpar = document.getElementById("btn-limpar");

// Elementos do DOM - Tabela, Filtros e Estados
const btnRecarregar = document.getElementById("btn-recarregar");
const filtroBusca = document.getElementById("filtro-busca");
const filtroStatus = document.getElementById("filtro-status");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorStateMessage = document.getElementById("error-state-message");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const tableContainer = document.getElementById("table-container");
const tabelaCorpo = document.getElementById("tabela-ordens-corpo");
const emptyState = document.getElementById("empty-state");
const emptyStateTitle = document.getElementById("empty-state-title");
const emptyStateDesc = document.getElementById("empty-state-desc");

// Elementos do DOM - Modal Visualizar
const modalVisualizar = document.getElementById("modal-visualizar");
const detalhesConteudo = document.getElementById("detalhes-conteudo");
const btnFecharDetalhes = document.getElementById("btn-fechar-detalhes");
const btnFecharModalDetalhes = document.getElementById("btn-fechar-modal-detalhes");
const btnEditarDosDetalhes = document.getElementById("btn-editar-dos-detalhes");

// Elementos do DOM - Modal Excluir
const modalExcluir = document.getElementById("modal-excluir");
const excluirOrdemIdEl = document.getElementById("excluir-ordem-id");
const btnCancelarExcluir = document.getElementById("btn-cancelar-excluir");
const btnCancelarExcluirX = document.getElementById("btn-cancelar-excluir-x");
const btnConfirmarExcluir = document.getElementById("btn-confirmar-excluir");

// =============================================================================
// Inicialização
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  vincularEventos();
  listarOrdens();
});

// =============================================================================
// Funções Utilitárias e Visuais
// =============================================================================

/**
 * Formata um valor numérico para Moeda Brasileira (R$ 0,00)
 */
function formatarMoeda(valor) {
  const num = Number(valor) || 0;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Exibe alertas de sucesso, erro ou informação para o usuário
 */
function exibirFeedback(mensagem, tipo = "success") {
  formFeedback.className = `feedback-message feedback-${tipo}`;
  formFeedback.textContent = mensagem;
  formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });

  clearTimeout(formFeedback._timer);
  formFeedback._timer = setTimeout(() => {
    formFeedback.className = "feedback-message";
    formFeedback.textContent = "";
  }, 6000);
}

/**
 * Atualiza o indicador visual de status da API no cabeçalho
 */
function atualizarStatusApi(status, mensagem) {
  if (!apiStatusContainer || !apiStatusText) return;
  const indicator = apiStatusContainer.querySelector(".status-indicator");

  if (status === "online") {
    if (indicator) indicator.className = "status-indicator status-online";
    apiStatusText.textContent = mensagem || "API Conectada";
  } else if (status === "offline") {
    if (indicator) indicator.className = "status-indicator status-offline";
    apiStatusText.textContent = mensagem || "Sem conexão com a API";
  } else if (status === "loading") {
    if (indicator) indicator.className = "status-indicator status-loading";
    apiStatusText.textContent = mensagem || "Sincronizando...";
  }
}

/**
 * Atualiza os cartões de métricas no topo da página
 */
function atualizarMetricas() {
  const total = listaOrdens.length;
  const concluidas = listaOrdens.filter(o => o.concluida === true || o.concluida === "true" || o.concluida === 1).length;
  const pendentes = total - concluidas;
  const valorTotal = listaOrdens.reduce((acc, o) => acc + (Number(o.valor) || 0), 0);

  metricTotal.textContent = total.toString();
  metricPendentes.textContent = pendentes.toString();
  metricConcluidas.textContent = concluidas.toString();
  metricValorTotal.textContent = formatarMoeda(valorTotal);
}

/**
 * Desabilita ou habilita botões durante requisições de gravação
 */
function alternarBloqueioBotoes(bloquear, textoBotao = null) {
  enviandoRequisicao = bloquear;
  btnSubmit.disabled = bloquear;
  btnLimpar.disabled = bloquear;
  btnCancelar.disabled = bloquear;
  btnRecarregar.disabled = bloquear;

  if (textoBotao) {
    btnSubmit.textContent = textoBotao;
  }
}

// =============================================================================
// Comunicação com a API (CRUD)
// =============================================================================

/**
 * 1. LISTAR ORDENS (GET /api/ordens)
 * Trata resposta HTTP 200, exibe carregamento, lista vazia e erros de conexão.
 */
async function listarOrdens() {
  loadingState.style.display = "flex";
  errorState.style.display = "none";
  emptyState.style.display = "none";
  tableContainer.style.display = "none";
  atualizarStatusApi("loading", "Consultando API...");

  try {
    const resposta = await fetch(API_URL, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!resposta.ok) {
      throw new Error(`Erro na API (${resposta.status}): ${resposta.statusText}`);
    }

    const dados = await resposta.json();
    if (!Array.isArray(dados)) {
      throw new Error("A API não retornou uma lista válida de ordens.");
    }

    listaOrdens = dados;
    atualizarStatusApi("online", "API Conectada");
    loadingState.style.display = "none";
    atualizarMetricas();
    renderizarTabela();
  } catch (erro) {
    console.error("Falha ao carregar ordens da API:", erro);
    loadingState.style.display = "none";
    tableContainer.style.display = "none";
    emptyState.style.display = "none";
    errorState.style.display = "flex";
    errorStateMessage.textContent = `Não foi possível carregar as ordens de serviço: ${erro.message}`;
    atualizarStatusApi("offline", "Falha de Conexão");
  }
}

/**
 * 2. CARREGAR ORDEM PARA EDIÇÃO (GET /api/ordens/{id})
 * Busca a ordem no backend e preenche os campos do formulário existente.
 */
async function carregarOrdemParaEdicao(id) {
  if (!id) return;
  const idNum = Number(id);

  let ordem = listaOrdens.find(o => Number(o.id ?? o.Id) === idNum);

  try {
    const resposta = await fetch(`${API_URL}/${idNum}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (resposta.ok) {
      ordem = await resposta.json();
    } else if (resposta.status === 404) {
      exibirFeedback(`Ordem #${idNum} não foi encontrada na API (404).`, "error");
      return;
    }
  } catch (erro) {
    console.warn("Aviso: Falha ao obter dados individuais via GET /api/ordens/{id}, utilizando dados em cache:", erro);
  }

  if (!ordem) {
    exibirFeedback(`Não foi possível carregar os dados da ordem #${idNum}.`, "error");
    return;
  }

  const idReal = Number(ordem.id ?? ordem.Id ?? idNum);

  // Preenche o formulário existente
  inputId.value = idReal.toString();
  inputCliente.value = ordem.cliente ?? "";
  inputVeiculo.value = ordem.veiculo ?? "";
  inputServico.value = ordem.servico ?? "";
  inputValor.value = (ordem.valor !== undefined && ordem.valor !== null) ? ordem.valor : "";

  // O campo concluida deve ser booleano: true para Concluída e false para Pendente
  const isConcluida = Boolean(ordem.concluida === true || ordem.concluida === "true" || ordem.concluida === 1);
  selectConcluida.value = isConcluida ? "true" : "false";

  // Altera para Modo de Edição
  formHeading.textContent = `Editar Ordem de Serviço #${idReal}`;
  formModeBadge.textContent = "Modo de Edição";
  formModeBadge.className = "badge badge-edit";
  btnSubmit.textContent = "Salvar Alterações";
  btnCancelar.style.display = "inline-flex";

  inputCliente.focus();
  inputCliente.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * 3. SALVAR ORDEM (POST /api/ordens para criar, PUT /api/ordens/{id} para editar)
 * Envia cliente, veiculo, servico, valor e concluida (booleano).
 */
async function salvarOrdem(evento) {
  evento.preventDefault();

  if (enviandoRequisicao) return;

  const cliente = inputCliente.value.trim();
  const veiculo = inputVeiculo.value.trim();
  const servico = inputServico.value.trim();
  const valor = parseFloat(inputValor.value);

  // Validação simples dos campos
  if (!cliente) {
    exibirFeedback("Por favor, informe o nome do cliente.", "error");
    inputCliente.focus();
    return;
  }
  if (!veiculo) {
    exibirFeedback("Por favor, informe o modelo do veículo.", "error");
    inputVeiculo.focus();
    return;
  }
  if (!servico) {
    exibirFeedback("Por favor, descreva o serviço a ser realizado.", "error");
    inputServico.focus();
    return;
  }
  if (isNaN(valor) || valor < 0) {
    exibirFeedback("Por favor, informe um valor numérico válido (maior ou igual a zero).", "error");
    inputValor.focus();
    return;
  }

  // O campo concluida deve ser booleano: true para Concluída e false para Pendente
  const concluida = selectConcluida.value === "true";

  const payload = {
    cliente: cliente,
    veiculo: veiculo,
    servico: servico,
    valor: valor,
    concluida: concluida // boolean
  };

  const idAtualStr = inputId.value ? inputId.value.trim() : "";
  const idAtual = idAtualStr ? parseInt(idAtualStr, 10) : null;

  if (idAtual) {
    // EDIÇÃO: PUT /api/ordens/{id}
    alternarBloqueioBotoes(true, "Salvando alterações...");
    try {
      const resposta = await fetch(`${API_URL}/${idAtual}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        if (resposta.status === 404) {
          throw new Error(`Ordem #${idAtual} não foi encontrada no servidor (404).`);
        }
        throw new Error(`Erro na API (${resposta.status}): ${resposta.statusText}`);
      }

      exibirFeedback(`Ordem de serviço #${idAtual} atualizada com sucesso!`, "success");
      cancelarModoEdicao();

      // Recarrega os dados da API após gravação
      await listarOrdens();
    } catch (erro) {
      console.error("Erro ao atualizar ordem:", erro);
      exibirFeedback(`Falha ao salvar alterações: ${erro.message}`, "error");
    } finally {
      alternarBloqueioBotoes(false, inputId.value ? "Salvar Alterações" : "Cadastrar Ordem");
    }
  } else {
    // CRIAÇÃO: POST /api/ordens
    alternarBloqueioBotoes(true, "Cadastrando ordem...");
    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        throw new Error(`Erro na API (${resposta.status}): ${resposta.statusText}`);
      }

      const novaOrdem = await resposta.json();
      const idNova = novaOrdem.id ?? novaOrdem.Id ?? "";

      exibirFeedback(`Ordem de serviço #${idNova} cadastrada com sucesso!`, "success");
      limparCamposFormulario();

      // Recarrega os dados da API após gravação
      await listarOrdens();
    } catch (erro) {
      console.error("Erro ao cadastrar ordem:", erro);
      exibirFeedback(`Falha ao cadastrar ordem: ${erro.message}`, "error");
    } finally {
      alternarBloqueioBotoes(false, "Cadastrar Ordem");
    }
  }
}

/**
 * 4. EXCLUIR ORDEM (DELETE /api/ordens/{id})
 * Abre o modal de confirmação existente e envia DELETE para a API.
 */
function abrirModalExclusao(id) {
  if (!id) return;
  idParaExcluir = Number(id);
  excluirOrdemIdEl.textContent = `#${idParaExcluir}`;

  if (typeof modalExcluir.showModal === "function") {
    modalExcluir.showModal();
  } else {
    modalExcluir.setAttribute("open", "true");
  }
  btnCancelarExcluir.focus();
}

function fecharModalExclusao() {
  if (typeof modalExcluir.close === "function") {
    modalExcluir.close();
  } else {
    modalExcluir.removeAttribute("open");
  }
  idParaExcluir = null;
}

async function confirmarExclusaoOrdem() {
  if (!idParaExcluir || enviandoRequisicao) return;

  const idExcluir = idParaExcluir;
  btnConfirmarExcluir.disabled = true;
  btnConfirmarExcluir.textContent = "Excluindo...";

  try {
    const resposta = await fetch(`${API_URL}/${idExcluir}`, {
      method: "DELETE",
      headers: { "Accept": "application/json" }
    });

    // Trata HTTP 204 NoContent ou 200 OK
    if (resposta.status === 204 || resposta.status === 200 || resposta.ok) {
      // Se a ordem em edição era a mesma excluída, reseta o formulário
      if (inputId.value && parseInt(inputId.value, 10) === idExcluir) {
        cancelarModoEdicao();
      }

      fecharModalExclusao();
      exibirFeedback(`Ordem de serviço #${idExcluir} foi excluída com sucesso!`, "info");

      // Recarrega os dados da API após gravação
      await listarOrdens();
      return;
    }

    if (resposta.status === 404) {
      throw new Error(`Ordem #${idExcluir} não foi encontrada no servidor (404).`);
    }

    throw new Error(`Erro na API (${resposta.status}): ${resposta.statusText}`);
  } catch (erro) {
    console.error("Falha ao excluir ordem:", erro);
    exibirFeedback(`Falha ao excluir ordem #${idExcluir}: ${erro.message}`, "error");
    fecharModalExclusao();
  } finally {
    btnConfirmarExcluir.disabled = false;
    btnConfirmarExcluir.textContent = "Sim, Excluir";
  }
}

/**
 * 5. VISUALIZAR DETALHES (GET /api/ordens/{id})
 */
async function abrirModalVisualizacao(id) {
  if (!id) return;
  const idNum = Number(id);

  let ordem = listaOrdens.find(o => Number(o.id ?? o.Id) === idNum);

  try {
    const resposta = await fetch(`${API_URL}/${idNum}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (resposta.ok) {
      ordem = await resposta.json();
    }
  } catch (e) {
    console.warn("Aviso ao buscar detalhes individuais:", e);
  }

  if (!ordem) return;

  const idReal = Number(ordem.id ?? ordem.Id ?? idNum);
  idEmVisualizacao = idReal;

  // Limpa o conteúdo anterior
  while (detalhesConteudo.firstChild) {
    detalhesConteudo.removeChild(detalhesConteudo.firstChild);
  }

  const dl = document.createElement("dl");
  dl.className = "details-grid";

  function criarLinhaDetalhe(termo, valorTexto, classeBadge = null) {
    const dt = document.createElement("dt");
    dt.textContent = termo;

    const dd = document.createElement("dd");
    if (classeBadge) {
      const span = document.createElement("span");
      span.className = `badge ${classeBadge}`;
      span.textContent = valorTexto;
      dd.appendChild(span);
    } else {
      dd.textContent = valorTexto;
    }

    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  const isConcluida = Boolean(ordem.concluida === true || ordem.concluida === "true" || ordem.concluida === 1);

  criarLinhaDetalhe("Número da OS:", `#${idReal}`);
  criarLinhaDetalhe("Cliente:", ordem.cliente ?? "");
  criarLinhaDetalhe("Veículo:", ordem.veiculo ?? "");
  criarLinhaDetalhe("Serviço:", ordem.servico ?? "");
  criarLinhaDetalhe("Valor Cobrado:", formatarMoeda(ordem.valor));

  const situacaoTexto = isConcluida ? "Concluída (Finalizado)" : "Pendente (Em andamento)";
  const situacaoBadge = isConcluida ? "badge-concluida" : "badge-pendente";
  criarLinhaDetalhe("Situação:", situacaoTexto, situacaoBadge);

  detalhesConteudo.appendChild(dl);

  if (typeof modalVisualizar.showModal === "function") {
    modalVisualizar.showModal();
  } else {
    modalVisualizar.setAttribute("open", "true");
  }
}

function fecharModalVisualizacao() {
  if (typeof modalVisualizar.close === "function") {
    modalVisualizar.close();
  } else {
    modalVisualizar.removeAttribute("open");
  }
  idEmVisualizacao = null;
}

// =============================================================================
// Controle do Formulário
// =============================================================================

function cancelarModoEdicao() {
  limparCamposFormulario();
  formHeading.textContent = "Nova Ordem de Serviço";
  formModeBadge.textContent = "Novo Cadastro";
  formModeBadge.className = "badge badge-new";
  btnSubmit.textContent = "Cadastrar Ordem";
  btnCancelar.style.display = "none";
}

function limparCamposFormulario() {
  inputId.value = "";
  inputCliente.value = "";
  inputVeiculo.value = "";
  inputServico.value = "";
  inputValor.value = "";
  selectConcluida.value = "false";
}

// =============================================================================
// Renderização da Tabela (com textContent e Listeners Diretos)
// =============================================================================

function renderizarTabela() {
  const termo = filtroBusca.value.trim().toLowerCase();
  const statusSelecionado = filtroStatus.value;

  const ordensFiltradas = listaOrdens.filter(ordem => {
    const isConcluida = Boolean(ordem.concluida === true || ordem.concluida === "true" || ordem.concluida === 1);

    const atendeStatus =
      statusSelecionado === "todos" ||
      (statusSelecionado === "concluida" && isConcluida) ||
      (statusSelecionado === "pendente" && !isConcluida);

    if (!atendeStatus) return false;

    if (!termo) return true;

    const idStr = (ordem.id ?? ordem.Id ?? "").toString();
    const clienteStr = (ordem.cliente || "").toLowerCase();
    const veiculoStr = (ordem.veiculo || "").toLowerCase();
    const servicoStr = (ordem.servico || "").toLowerCase();

    return (
      idStr.includes(termo) ||
      clienteStr.includes(termo) ||
      veiculoStr.includes(termo) ||
      servicoStr.includes(termo)
    );
  });

  // Limpa o corpo da tabela
  while (tabelaCorpo.firstChild) {
    tabelaCorpo.removeChild(tabelaCorpo.firstChild);
  }

  if (ordensFiltradas.length === 0) {
    tableContainer.style.display = "none";
    emptyState.style.display = "block";

    if (listaOrdens.length === 0) {
      emptyStateTitle.textContent = "Nenhuma ordem de serviço cadastrada no banco de dados.";
      emptyStateDesc.textContent = "Utilize o formulário ao lado para cadastrar a primeira ordem.";
    } else {
      emptyStateTitle.textContent = "Nenhuma ordem corresponde aos filtros aplicados.";
      emptyStateDesc.textContent = "Tente alterar os termos de busca ou o filtro de situação.";
    }
  } else {
    emptyState.style.display = "none";
    tableContainer.style.display = "block";

    ordensFiltradas.forEach(ordem => {
      const idReal = Number(ordem.id ?? ordem.Id);
      const isConcluida = Boolean(ordem.concluida === true || ordem.concluida === "true" || ordem.concluida === 1);

      const tr = document.createElement("tr");

      // ID
      const tdId = document.createElement("td");
      tdId.className = "col-id";
      tdId.textContent = `#${idReal}`;
      tr.appendChild(tdId);

      // Cliente
      const tdCliente = document.createElement("td");
      const strongCliente = document.createElement("strong");
      strongCliente.textContent = ordem.cliente ?? "";
      tdCliente.appendChild(strongCliente);
      tr.appendChild(tdCliente);

      // Veículo
      const tdVeiculo = document.createElement("td");
      tdVeiculo.textContent = ordem.veiculo ?? "";
      tr.appendChild(tdVeiculo);

      // Serviço
      const tdServico = document.createElement("td");
      tdServico.textContent = ordem.servico ?? "";
      tr.appendChild(tdServico);

      // Valor
      const tdValor = document.createElement("td");
      tdValor.className = "col-valor";
      tdValor.textContent = formatarMoeda(ordem.valor);
      tr.appendChild(tdValor);

      // Situação
      const tdStatus = document.createElement("td");
      tdStatus.className = "col-status";
      const badgeStatus = document.createElement("span");
      if (isConcluida) {
        badgeStatus.className = "badge badge-concluida";
        badgeStatus.textContent = "Concluída";
      } else {
        badgeStatus.className = "badge badge-pendente";
        badgeStatus.textContent = "Pendente";
      }
      tdStatus.appendChild(badgeStatus);
      tr.appendChild(tdStatus);

      // Ações (Ver, Editar, Excluir)
      const tdAcoes = document.createElement("td");
      tdAcoes.className = "col-acoes";

      const actionDiv = document.createElement("div");
      actionDiv.className = "action-buttons";

      // Botão Ver
      const btnVer = document.createElement("button");
      btnVer.type = "button";
      btnVer.className = "btn btn-sm btn-outline";
      btnVer.textContent = "Ver";
      btnVer.title = "Visualizar detalhes da ordem";
      btnVer.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalVisualizacao(idReal);
      });

      // Botão Editar
      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.className = "btn btn-sm btn-outline";
      btnEditar.textContent = "Editar";
      btnEditar.title = "Editar esta ordem";
      btnEditar.addEventListener("click", (e) => {
        e.stopPropagation();
        carregarOrdemParaEdicao(idReal);
      });

      // Botão Excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.type = "button";
      btnExcluir.className = "btn btn-sm btn-danger-outline";
      btnExcluir.textContent = "Excluir";
      btnExcluir.title = "Excluir ordem do sistema";
      btnExcluir.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalExclusao(idReal);
      });

      actionDiv.appendChild(btnVer);
      actionDiv.appendChild(btnEditar);
      actionDiv.appendChild(btnExcluir);
      tdAcoes.appendChild(actionDiv);
      tr.appendChild(tdAcoes);

      tabelaCorpo.appendChild(tr);
    });
  }
}

// =============================================================================
// Registro de Eventos
// =============================================================================
function vincularEventos() {
  // Envio do formulário (Criar ou Editar)
  formOrdem.addEventListener("submit", salvarOrdem);

  // Botões do formulário
  btnCancelar.addEventListener("click", cancelarModoEdicao);
  btnLimpar.addEventListener("click", () => {
    limparCamposFormulario();
    exibirFeedback("Campos do formulário limpos.", "info");
  });

  // Atualizar lista da API
  btnRecarregar.addEventListener("click", listarOrdens);
  btnTentarNovamente.addEventListener("click", listarOrdens);

  // Filtros de busca e status na tabela
  filtroBusca.addEventListener("input", renderizarTabela);
  filtroStatus.addEventListener("change", renderizarTabela);

  // Modal de Detalhes
  btnFecharDetalhes.addEventListener("click", fecharModalVisualizacao);
  btnFecharModalDetalhes.addEventListener("click", fecharModalVisualizacao);
  btnEditarDosDetalhes.addEventListener("click", () => {
    if (idEmVisualizacao) {
      const idParaEditar = idEmVisualizacao;
      fecharModalVisualizacao();
      carregarOrdemParaEdicao(idParaEditar);
    }
  });

  // Modal de Exclusão
  btnCancelarExcluir.addEventListener("click", fecharModalExclusao);
  btnCancelarExcluirX.addEventListener("click", fecharModalExclusao);
  btnConfirmarExcluir.addEventListener("click", (e) => {
    e.preventDefault();
    confirmarExclusaoOrdem();
  });

  // Fechamento no backdrop dos modais nativos (<dialog>)
  modalVisualizar.addEventListener("click", (e) => {
    if (e.target === modalVisualizar) {
      fecharModalVisualizacao();
    }
  });

  modalExcluir.addEventListener("click", (e) => {
    if (e.target === modalExcluir) {
      fecharModalExclusao();
    }
  });
}