console.log("SCRIPT CARREGOU");
const input = document.getElementById("user-input");
const chatArea = document.getElementById("chat-area");
const chatContainer = document.getElementById("chat-container");
const modeBadge = document.getElementById("modeBadge");
const SECRET_CLEAR_CODE = "//clearAll";

function atualizarModoBadge() {
  if (!feiraSelecionada) {
    modeBadge.classList.remove("show", "classificacao");
    modeBadge.textContent = "";
    return;
  }

  modeBadge.classList.add("show", "classificacao");
  if (feiraSelecionada === "MOSTRATEC") {
    modeBadge.textContent = "🔬 Classificando para Mostratec";
  } else if (feiraSelecionada === "FEBRACE") {
    modeBadge.textContent = "🏆 Classificando para FEBRACE";
  } else if (feiraSelecionada === "Ciências para Todos") {
    modeBadge.textContent = "🌍 Classificando para Ciências para Todos";
  } else if (feiraSelecionada === "12ª DIREC") {
    modeBadge.textContent = "📊 Classificando para 12ª DIREC";
  } else {
    modeBadge.textContent = "🏷️ Classificação ativa";
  }
}

modeBadge.addEventListener("click", () => {
  if (feiraSelecionada) {
    feiraSelecionada = "";
    input.placeholder = "O que vamos fazer hoje?";
    atualizarModoBadge();
  }
});

function ajustarAlturaTextarea() {
  const maxHeight = window.innerHeight * 0.35;
  const newHeight = Math.min(input.scrollHeight, maxHeight);

  // Only update if height actually changed
  if (input.offsetHeight !== newHeight) {
    input.style.height = `${newHeight}px`;
  }
}

function resetarAlturaTextarea() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, window.innerHeight * 0.35)}px`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatarRespostaIA(texto) {
  if (!texto) return "";

  let formatado = texto
    .replace(/\*\*(.*?)\*\*/gs, "<strong>$1</strong>")
    .replace(/_([^_\n]+?)_/g, "<em>$1</em>")
    .replace(/\*([^\*\n]+?)\*/g, "<em>$1</em>");

  return formatado
    .split(/\n\n+/)
    .map((bloco) => {
      const linhas = bloco
        .split(/\n/)
        .map((linha) => linha.trim())
        .filter((linha) => linha !== "");

      if (linhas.length === 0) {
        return '<div style="height: 12px;"></div>';
      }

      const conteudo = linhas
        .map((linha, index) => {
          if (index === 0) {
            return `<div style="line-height: 1.6;">${linha}</div>`;
          }
          return `<div style="margin-top: 6px; line-height: 1.6;">${linha}</div>`;
        })
        .join("");

      return `<div style="margin-bottom: 20px;">${conteudo}</div>`;
    })
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderizarCardDrive(driveUrl, driveTitle, elementoAnterior) {
  try {
    const card = document.createElement("div");
    card.classList.add("drive-card");

    const a = document.createElement("a");
    a.classList.add("drive-card-link");
    a.setAttribute("href", driveUrl);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");

    const inner = document.createElement("div");
    inner.classList.add("drive-card-inner");

    const icon = document.createElement("div");
    icon.classList.add("drive-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "📁";

    const texts = document.createElement("div");
    texts.classList.add("drive-texts");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("drive-title");
    titleDiv.innerHTML = escapeHtml(driveTitle);

    const subDiv = document.createElement("div");
    subDiv.classList.add("drive-sub");
    subDiv.textContent = "Abrir no Google Drive";

    const arrow = document.createElement("div");
    arrow.classList.add("drive-arrow");
    arrow.textContent = "↗";

    texts.appendChild(titleDiv);
    texts.appendChild(subDiv);
    inner.appendChild(icon);
    inner.appendChild(texts);
    inner.appendChild(arrow);
    a.appendChild(inner);
    card.appendChild(a);

    elementoAnterior.after(card);
  } catch (e) {
    console.error("Erro criando card do Drive:", e);
  }
}

async function digitarTexto(elemento, html, velocidade = 5) {
  elemento.innerHTML = "";
  let exibicaoParcial = "";
  let indice = 0;

  while (indice < html.length) {
    if (html[indice] === "<") {
      const fechamento = html.indexOf(">", indice);
      if (fechamento === -1) {
        exibicaoParcial += html[indice];
        indice += 1;
      } else {
        exibicaoParcial += html.slice(indice, fechamento + 1);
        indice = fechamento + 1;
      }
    } else {
      exibicaoParcial += html[indice];
      indice += 1;
      elemento.innerHTML = exibicaoParcial;
      // Removido scroll dentro do loop para evitar "puxar" o usuário a cada caractere
      await sleep(velocidade);
    }
  }

  elemento.innerHTML = exibicaoParcial;
}

input.addEventListener("input", ajustarAlturaTextarea);
ajustarAlturaTextarea();

let subir = 0;
let primeiravez = true;
const cal = document.getElementById("calculadora");
const divs = ["chat-area"];
const hist = document.getElementById("hist");
const calcula = document.getElementById("calculadoraverdade");
const adicionar = document.getElementById("adcionar");
const remover = document.getElementById("remover");
const calculadoraGrid = document.getElementById("calculadoraGrid");

let itens = [];

let carregando = false;

let historicoConversa = [];
let chatMessages = [];

function limparHistorico() {
  historicoConversa = [];
  localStorage.removeItem("historicoConversa");
}

function limparChatSalvo() {
  chatMessages = [];
  historicoConversa = [];
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("historicoConversa");
}

function salvarConversaAtual() {
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
  localStorage.setItem("historicoConversa", JSON.stringify(historicoConversa));
}

function carregarConversaAtual() {
  const dadosChat = localStorage.getItem("chatMessages");
  const dadosHistorico = localStorage.getItem("historicoConversa");

  if (dadosChat) {
    try {
      const mensagens = JSON.parse(dadosChat);
      if (Array.isArray(mensagens) && mensagens.length > 0) {
        chatMessages = mensagens;
        mensagens.forEach((item) => {
          const messageElement = document.createElement("div");
          messageElement.classList.add(
            "message",
            item.role === "assistant" ? "bot" : "user",
          );

          if (item.role === "assistant") {
            messageElement.innerHTML = formatarRespostaIA(item.content);
          } else {
            messageElement.textContent = item.content;
          }

          chatArea.appendChild(messageElement);

          // Se a mensagem do bot tem link do Drive, renderiza o card
          if (item.role === "assistant" && item.driveUrl && item.driveTitle) {
            renderizarCardDrive(item.driveUrl, item.driveTitle, messageElement);
          }
        });
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
        primeiravez = false;

        const chatAra = document.getElementById("hero");
        const sug = document.getElementById("suggestions");
        if (chatAra) chatAra.style.display = "none";
        if (sug) sug.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao carregar chat salvo:", error);
      chatMessages = [];
    }
  }

  if (dadosHistorico) {
    try {
      const historico = JSON.parse(dadosHistorico);
      if (Array.isArray(historico)) {
        historicoConversa = historico;
      }
    } catch (error) {
      console.error("Erro ao carregar histórico salvo:", error);
      historicoConversa = [];
    }
  }
}

let contexto = "";
let feiraSelecionada = "";

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // Shift+Enter: quebra de linha
      return; // deixa o comportamento padrão
    } else {
      // Enter: enviar mensagem
      event.preventDefault();
      enviarMensagem();
    }
  }
});

function toggleFeiraPopup() {
  const popup = document.getElementById("feiraPopup");
  popup.classList.toggle("show");
}

function selecionarFeira(opcao) {
  if (feiraSelecionada === opcao) {
    feiraSelecionada = "";
  } else {
    feiraSelecionada = opcao;
  }

  document.getElementById("feiraPopup").classList.remove("show");

  if (feiraSelecionada) {
    input.placeholder = `Pergunte sobre ${feiraSelecionada}`;
  } else {
    input.placeholder = "O que vamos fazer hoje?";
  }

  atualizarModoBadge();
}

window.addEventListener("click", (event) => {
  const popup = document.getElementById("feiraPopup");
  const toggle = event.target.closest(".options-input-area");
  const insidePopup = event.target.closest(".feira-popup");
  if (!toggle && !insidePopup && popup) {
    popup.classList.remove("show");
  }
});

async function enviarMensagem() {
  const userMessage = input.value.trim();
  if (userMessage === "") return;

  console.log("FUNCIONOU");

  if (userMessage === SECRET_CLEAR_CODE) {
    limparChatSalvo();
    chatArea.innerHTML = "";
    primeiravez = true;

    const chatAra = document.getElementById("hero");
    const sug = document.getElementById("suggestions");
    if (chatAra) chatAra.style.display = "block";
    if (sug) sug.style.display = "block";

    input.value = "";
    resetarAlturaTextarea();
    window.location.reload();
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "user");
  messageElement.textContent = userMessage;
  chatArea.appendChild(messageElement);
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });

  if (primeiravez === true) {
    const chatAra = document.getElementById("hero");
    const sug = document.getElementById("suggestions");

    chatAra.classList.add("fade-out1");
    sug.classList.add("fade-out2");

    setTimeout(() => {
      chatAra.style.display = "none";
      sug.style.display = "none";
    }, 500);

    primeiravez = false;
  }

  input.value = "";
  resetarAlturaTextarea();

  const aiElement = document.createElement("div");
  aiElement.classList.add("message", "bot");
  aiElement.textContent = "pensando...";
  chatArea.appendChild(aiElement);

  chatMessages.push({ role: "user", content: userMessage });
  salvarConversaAtual();

  const modo = feiraSelecionada ? "classificacao" : "conversa";

  let promptFinal = userMessage;

  if (feiraSelecionada) {
    promptFinal =
      `[O usuário escolheu focar na feira: ${feiraSelecionada}]. ` +
      `Resumo do projeto: ${userMessage}`;
  }

  // Mapear para FEBRACE apenas no envio
  let feiraMapeada = feiraSelecionada;
  if (
    feiraSelecionada === "Ciências para Todos" ||
    feiraSelecionada === "12ª DIREC"
  ) {
    feiraMapeada = "FEBRACE";
  }

  try {
    const url =
      "https://davidumbproxmax-classificador-mostratec.hf.space/classificar";

    console.log("Chamando a API de IA Híbrida...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        modo,
        feira: feiraMapeada || "",
        mensagem: userMessage,
        resumo: promptFinal,
        historico: historicoConversa,
      }),
    });

    const data = await response.json();

    if (data.resultado) {
      let textoIA = data.resultado;

      // Verifica se existe a tag do Drive no formato: [DRIVE_LINK: URL | TITULO]
      const driveRegex = /\[DRIVE_LINK:\s*([^\|\]]+)\|\s*([^\]]+)\]/i;
      const driveMatch = textoIA.match(driveRegex);
      let driveUrl = null;
      let driveTitle = null;

      if (driveMatch) {
        driveUrl = driveMatch[1].trim();
        driveTitle = driveMatch[2].trim();
        // Remove a tag inteira do texto para não exibir o código bruto ao usuário
        textoIA = textoIA.replace(driveMatch[0], "").trim();
      }

      // Salva histórico APENAS depois da resposta chegar (usa o texto limpo)
      if (modo === "conversa") {
        historicoConversa.push({
          role: "user",
          content: userMessage,
        });

        historicoConversa.push({
          role: "assistant",
          content: textoIA,
        });
      }

      chatMessages.push({
        role: "assistant",
        content: textoIA,
        driveUrl: driveUrl || null,
        driveTitle: driveTitle || null,
      });
      salvarConversaAtual();

      // Mantém somente as últimas 10 mensagens
      if (historicoConversa.length > 10) {
        historicoConversa = historicoConversa.slice(-10);
      }

      console.log("Histórico atual:", historicoConversa);

      const textoFormatado = formatarRespostaIA(textoIA);
      // Rolagem única para o final do chat quando a IA começa a digitar
      chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
      aiElement.innerHTML = textoFormatado;

      // Se havia link do Drive, cria um card clicável logo abaixo do balão
      if (driveUrl && driveTitle) {
        renderizarCardDrive(driveUrl, driveTitle, aiElement);
        // Rolagem para mostrar o card
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
      }

      salvarConversaAtual();
    } else {
      aiElement.textContent = "Erro na resposta do backend da IA.";
      console.log("Erro detalhado:", data);
    }
  } catch (erro) {
    aiElement.textContent = "Erro de conexão com o servidor de IA!";
    console.error("Erro no Fetch:", erro);
  }
}

function btn(entrada) {
  if (entrada == 1) {
    input.value = "Dados e Estatísticas";
    enviarMensagem();
    if (primeiravez) {
      const chatAra = document.getElementById("hero");
      const sug = document.getElementById("suggestions");
      chatAra.classList.add("fade-out1");
      sug.classList.add("fade-out2");
      setTimeout(() => {
        chatAra.style.display = "none";
        sug.style.display = "none";
      }, 500);
      primeiravez = false;
    }
    input.value = "";
  } else if (entrada == 2) {
    input.value = "Dados e Estatísticas";
    enviarMensagem();
    if (primeiravez) {
      const chatAra = document.getElementById("hero");
      const sug = document.getElementById("suggestions");
      chatAra.classList.add("fade-out");
      sug.classList.add("fade-out2");
      setTimeout(() => {
        chatAra.style.display = "none";
        sug.style.display = "none";
      }, 500);
      primeiravez = false;
    }
    input.value = "";
  } else if (entrada == 3) {
    input.value = "Mapa dos Estandes";
    enviarMensagem();
    if (primeiravez) {
      const chatAra = document.getElementById("hero");
      const sug = document.getElementById("suggestions");
      chatAra.classList.add("fade-out1");
      sug.classList.add("fade-out2");
      setTimeout(() => {
        chatAra.style.display = "none";
        sug.style.display = "none";
      }, 500);
      primeiravez = false;
    }
    input.value = "";
  } else if (entrada == 4) {
    input.value = "Pesos da Avaliação";
    enviarMensagem();
    if (primeiravez) {
      const chatAra = document.getElementById("hero");
      const sug = document.getElementById("suggestions");
      chatAra.classList.add("fade-out1");
      sug.classList.add("fade-out2");
      setTimeout(() => {
        chatAra.style.display = "none";
        sug.style.display = "none";
      }, 500);
      primeiravez = false;
    }
    input.value = "";
  }
}

function browser() {
  if (calcula.classList.contains("hidden")) {
    if (hist.classList.contains("show")) {
      if (hist.classList.contains("desanimou")) {
        hist.classList.toggle("desanimou");
      }
      hist.classList.toggle("show");
      hist.classList.toggle("animou");
    } else {
      setTimeout((e) => {
        hist.classList.toggle("show");
        if (hist.classList.contains("desanimou")) {
          hist.classList.toggle("desanimou");
        }
      }, 500);
      hist.classList.toggle("desanimou");
      hist.classList.toggle("animou");
    }
  } else {
    calcula.classList.toggle("hidden");
    if (hist.classList.contains("show")) {
      if (hist.classList.contains("desanimou")) {
        hist.classList.toggle("desanimou");
      }
      hist.classList.toggle("show");
      hist.classList.toggle("animou");
    }
  }
}

const urlParams = new URLSearchParams(window.location.search);
const mensagemInicial = urlParams.get("msg");
if (mensagemInicial) {
  input.value = mensagemInicial;
  enviarMensagem();
  const novaUrl = window.location.pathname;
  window.history.replaceState({}, document.title, novaUrl);
  if (primeiravez) {
    const chatAra = document.getElementById("hero");
    const sug = document.getElementById("suggestions");
    chatAra.classList.add("fade-out1");
    sug.classList.add("fade-out2");
    setTimeout(() => {
      chatAra.style.display = "none";
      sug.style.display = "none";
    }, 500);
    primeiravez = false;
  }
  input.value = "";
}

function calculadora() {
  if (hist.classList.contains("show")) {
    calcula.classList.toggle("hidden");
  } else {
    calcula.classList.toggle("hidden");
    setTimeout((e) => {
      hist.classList.toggle("show");
      if (hist.classList.contains("desanimou")) {
        hist.classList.toggle("desanimou");
      }
    }, 500);
    hist.classList.toggle("desanimou");
    hist.classList.toggle("animou");
  }
}

document.getElementById("materialInput").addEventListener("keydown", (e) => {
  const materialinput = document.getElementById("materialInput");
  const precoinput = document.getElementById("precoInput");

  if (e.key === "Enter") {
    if (materialinput.value !== "" && precoinput.value !== "") {
      adicionarMaterial().classList.add("pareceuu");
      salvarcalculadora();
      calcularTotal();
    } else {
      precoinput.focus();
    }
  }
});

const materialinput = document.getElementById("materialInput");
const precoinput = document.getElementById("precoInput");

document.getElementById("precoInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (materialinput.value !== "" && precoinput.value !== "") {
      adicionarMaterial();
    } else {
      materialinput.focus();
    }
  }
});

function adicionaraa() {
  if (materialinput.value !== "" && precoinput.value !== "") {
    adicionarMaterial();
  }
}

function adicionarMaterial(nome, preco, quantidade) {
  let item = {
    nome: nome ?? materialinput.value,
    preco: preco ?? precoinput.value,
    quantidade: quantidade ?? 1,
    novo: true,
  };

  itens.push(item);

  materialinput.value = "";
  precoinput.value = "";

  renderizar();
}

function renderizar() {
  const calculadoragrid = document.getElementById("calculadoraGrid");
  calculadoragrid.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("casa", "header-casa");

  const colNome = document.createElement("div");
  colNome.classList.add("calc-col", "material-label");
  colNome.textContent = "Material";

  const colPreco = document.createElement("div");
  colPreco.classList.add("calc-col", "preco-label");
  colPreco.textContent = "Preço";

  const colQtd = document.createElement("div");
  colQtd.classList.add("calc-col", "qtd-label");
  colQtd.textContent = "Qtd";

  const placeholder1 = document.createElement("div");
  const placeholder2 = document.createElement("div");
  const placeholder3 = document.createElement("div");

  header.appendChild(colNome);
  header.appendChild(colPreco);
  header.appendChild(colQtd);
  header.appendChild(placeholder1);
  header.appendChild(placeholder2);
  header.appendChild(placeholder3);
  calculadoragrid.appendChild(header);

  itens.forEach((item, index) => {
    criarLinha(item, index);
  });

  renderTabelaExcel();

  calcularTotal();
  salvarcalculadora();
}

function criarLinha(item, index) {
  const calculadoragrid = document.getElementById("calculadoraGrid");

  const novomaterial = document.createElement("textarea");
  const novopreco = document.createElement("textarea");
  const novaquantidade = document.createElement("input");
  const casa = document.createElement("div");
  const addqtd = document.createElement("button");
  const removeqtd = document.createElement("button");
  const deleti = document.createElement("button");

  novomaterial.classList.add("novomaterial");
  novomaterial.value = item.nome;
  setTimeout(() => {
    crescimento(novomaterial);
  }, 0);

  novomaterial.addEventListener("input", (e) => {
    crescimento(e.target);
    itens[index].nome = e.target.value;
  });

  novopreco.classList.add("novopreco");
  novopreco.rows = 1;
  novopreco.value = formatarPrecoExibicao(item.preco);
  novopreco.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && !/[0-9.,]/.test(e.key)) {
      e.preventDefault();
    }
  });

  novopreco.addEventListener("input", (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.,]/g, "");
    value = value.replace(/\./g, ",");

    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }

    e.target.value = value;

    crescimento(novopreco);
  });

  setTimeout(() => {
    crescimento(novopreco);
  }, 0);

  novaquantidade.classList.add("novaquantidade");
  novaquantidade.type = "number";
  novaquantidade.step = "1";
  novaquantidade.min = "1";
  novaquantidade.value = item.quantidade;

  addqtd.classList.add("addbtn");
  addqtd.innerHTML = "➕";

  removeqtd.classList.add("rmvbtn");
  removeqtd.innerHTML = "➖";

  deleti.classList.add("delete");
  deleti.innerHTML = "🗑";

  casa.classList.add("casa");
  if (item.novo) {
    casa.classList.add("pareceuu");

    item.novo = false;
  }

  novomaterial.addEventListener("input", (e) => {
    itens[index].nome = e.target.value;
    salvarcalculadora();
  });

  novopreco.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/,/g, ".");

    crescimento(novopreco);
    itens[index].preco = parseFloat(valor) || 0;

    calcularTotal();
    salvarcalculadora();
    renderTabelaExcel();
  });
  novaquantidade.addEventListener("input", (e) => {
    let valor = parseInt(e.target.value);

    if (isNaN(valor) || valor <= 0) {
      valor = 1;
    }

    itens[index].quantidade = valor;

    calcularTotal();
    salvarcalculadora();
  });

  addqtd.addEventListener("click", () => {
    itens[index].quantidade++;

    const linha = addqtd.parentElement;
    linha.querySelector(".novaquantidade").value = itens[index].quantidade;

    salvarcalculadora();
    calcularTotal();
    renderTabelaExcel();
  });

  removeqtd.addEventListener("click", () => {
    itens[index].quantidade--;

    if (itens[index].quantidade <= 0) {
      const casa = removeqtd.parentElement;

      casa.classList.add("hiddenn");

      setTimeout(() => {
        itens.splice(index, 1);
        renderizar();
      }, 200);
    } else {
      const linha = removeqtd.parentElement;
      linha.querySelector(".novaquantidade").value = itens[index].quantidade;

      salvarcalculadora();
      calcularTotal();
      renderTabelaExcel();
    }
  });

  deleti.addEventListener("click", () => {
    casa.classList.add("hiddenn");

    setTimeout(() => {
      itens.splice(index, 1);
      renderizar();
    }, 200);
  });

  casa.appendChild(novomaterial);
  casa.appendChild(novopreco);
  casa.appendChild(novaquantidade);
  casa.appendChild(addqtd);
  casa.appendChild(removeqtd);
  casa.appendChild(deleti);

  calculadoragrid.appendChild(casa);
}

function adicionarr(botao) {
  let linha = botao.parentElement;
  let qtd = linha.querySelector(".novaquantidade");

  let novaQtd = parseInt(qtd.innerText) + 1;

  qtd.value = novaQtd;

  salvarcalculadora();
  calcularTotal();
}

function removerr(botao) {
  let linha = botao.parentElement;
  let qtd = linha.querySelector(".novaquantidade");

  let novaQtd = parseInt(qtd.innerText) - 1;
  if (novaQtd <= 0) {
    linha.classList.add("hiddenn");
    setTimeout(() => {
      linha.remove();
      salvarcalculadora();
      calcularTotal();
    }, 100);
  }
  qtd.value = novaQtd;
  salvarcalculadora();
  calcularTotal();
}

function formatarTotal(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function formatarPrecoExibicao(valor) {
  const numero = Number(String(valor).replace(",", "."));
  if (isNaN(numero)) return "";
  return numero.toFixed(2).replace(".", ",");
}

function calcularTotal() {
  let total = 0;
  const casa = document.getElementById("calculadoraverdade");
  const aparecertotal = document.getElementById("total");
  const casaverdade = casa.querySelectorAll(".casa");

  casaverdade.forEach((casa) => {
    let novaquantidade = casa.querySelector(".novaquantidade");
    let novopreco = casa.querySelector(".novopreco");
    if (!novaquantidade || !novopreco) return;

    const preco = parseFloat(novopreco.value.replace(",", ".")) || 0;
    const quantidade = parseFloat(novaquantidade.value) || 0;
    total += preco * quantidade;
  });
  aparecertotal.textContent = formatarTotal(total) + " R$";
  localStorage.setItem("total", total);
}

function reset() {
  itens = [];

  localStorage.setItem("dadoscalculadora", JSON.stringify(itens));
  localStorage.setItem("total", 0);

  const aparecertotal = document.getElementById("total");
  if (aparecertotal) {
    aparecertotal.textContent = "0";
  }

  renderizar();
}

function salvarcalculadora() {
  if (carregando) return;

  localStorage.setItem("dadoscalculadora", JSON.stringify(itens));
}

function atualizarBotaoTabela() {
  const botao = document.getElementById("toggleTabela");
  const tabela = document.getElementById("tabelaExcel");
  if (!botao || !tabela) return;

  botao.textContent = tabela.classList.contains("hidden-tabela")
    ? "Mostrar tabela"
    : "Ocultar tabela";
}

function alternarTabela() {
  const tabela = document.getElementById("tabelaExcel");
  if (!tabela) return;

  tabela.classList.toggle("hidden-tabela");
  atualizarBotaoTabela();
}

window.onload = function () {
  carregando = true;

  carregarConversaAtual();

  const dados = localStorage.getItem("dadoscalculadora");
  const aparecertotal = document.getElementById("total");

  if (dados) {
    itens = JSON.parse(dados);
  }

  renderizar();
  calcularTotal();

  const toggleTabelaBotao = document.getElementById("toggleTabela");
  if (toggleTabelaBotao) {
    toggleTabelaBotao.addEventListener("click", alternarTabela);
    atualizarBotaoTabela();
  }

  carregando = false;
};

const grid = document.getElementById("calculadoraGrid");

grid.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    calcularTotal();
    salvarcalculadora();
  }
});

function crescimento(element) {
  if (!element) return;

  element.style.height = "47.5px";
  element.style.height = element.scrollHeight + "px";

  salvarcalculadora();
}

function renderTabelaExcel() {
  const tabela = document.getElementById("tabelaExcel");
  tabela.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("linha-excel");
  header.innerHTML = `
        <div>Material</div>
        <div>Preço</div>
        <div>Qtd</div>
        <div>Total</div>
    `;
  tabela.appendChild(header);

  itens.forEach((item) => {
    const linha = document.createElement("div");
    linha.classList.add("linha-excel");

    // Criamos os elementos internos manualmente para usar textContent
    const divNome = document.createElement("div");
    divNome.textContent = item.nome; // <--- ISSO AQUI É A CHAVE DA SEGURANÇA

    const divPreco = document.createElement("div");
    divPreco.textContent = Number(item.preco).toFixed(2).replace(".", ",");

    const divQtd = document.createElement("div");
    divQtd.textContent = item.quantidade;

    const divTotal = document.createElement("div");
    divTotal.textContent = (item.preco * item.quantidade)
      .toFixed(2)
      .replace(".", ",");

    // Adicionamos as colunas na linha
    linha.appendChild(divNome);
    linha.appendChild(divPreco);
    linha.appendChild(divQtd);
    linha.appendChild(divTotal);

    tabela.appendChild(linha);
  });
}

function escapeHTML(str) {
  const p = document.createElement("p");
  p.textContent = str;
  return p.innerHTML;
}
