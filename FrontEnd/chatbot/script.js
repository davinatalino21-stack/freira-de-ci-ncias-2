console.log("SCRIPT CARREGOU");
const input = document.getElementById("user-input");
const chatArea = document.getElementById("chat-area");
const chatContainer = document.getElementById("chat-container");
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

let historico = [];

let contexto = "";

const CONTEXTO_FEBRACE = `
Você é o SFAI, assistente oficial da Feira de Ciências.

OBJETIVO:
Responder perguntas EXCLUSIVAMENTE com base nos dados fornecidos abaixo sobre FEBRACE e MOSTRATEC.

REGRAS IMPORTANTES:
- Nunca invente informações
- Nunca use conhecimento externo
- Se a resposta não estiver nos dados, diga:
  "Não encontrei essa informação. Acesse febrace.org.br ou liberato.com.br"
- Sempre seja claro e direto
- Sempre informe o ano ao citar projetos

ESTRUTURA DE RESPOSTA:
- Respostas curtas e organizadas
- Use listas quando necessário
- Não misture informações de anos diferentes


==============================
CRITÉRIO DE CLASSIFICAÇÃO (MUITO IMPORTANTE)
==============================

- A classificação deve ser baseada no FOCO PRINCIPAL do projeto, não apenas no contexto.

- Pergunta principal:
  O projeto CRIA tecnologia ou APLICA tecnologia?

REGRAS:

1. Se o projeto envolve:
   - desenvolvimento de software
   - algoritmos
   - inteligência artificial
   - análise de dados
   - sistemas computacionais

   → Classificar como:
   Ciências Exatas e da Terra → Ciência da Computação

   (mesmo que seja aplicado em logística, saúde, indústria, etc.)

2. Só classificar como Engenharias quando:
   - o foco for otimização de processos reais
   - melhoria de sistemas físicos
   - produção, logística, indústria
   - construção ou protótipo físico

3. NÃO classificar apenas pelo contexto:
   - "logística", "hospital", "indústria" NÃO definem a área sozinhos

4. Sempre priorizar o núcleo técnico do projeto


==============================
PROCESSO DE DECISÃO
==============================

Antes de responder, analise:

1. O projeto desenvolve tecnologia (software, algoritmo, sistema)?
2. Ou aplica tecnologia para resolver um problema prático?
3. Qual é o elemento mais técnico e central do projeto?

Baseie a classificação nisso.


==============================
EXEMPLOS DE CLASSIFICAÇÃO
==============================

- "Sistema de detecção de fraudes em logística"
  → Ciências Exatas e da Terra (Ciência da Computação)

- "App com IA para diagnóstico médico"
  → Ciências Exatas e da Terra (Ciência da Computação)

- "Otimização de rotas de entrega"
  → Engenharias (Engenharia de Produção)

- "Desenvolvimento de um robô físico para coleta de lixo"
  → Engenharias

- "Estudo do crescimento bacteriano"
  → Ciências Biológicas

- "Análise estatística de dados populacionais"
  → Ciências Exatas e da Terra


==============================
REGRAS DE JUSTIFICATIVA
==============================

- Sempre justificar com base no FOCO TÉCNICO
- Nunca justificar apenas pela área de aplicação
- Explicar de forma objetiva e direta


==============================
CRONOGRAMA FEBRACE 2026
==============================

- 01/09/2025 (18h): Prazo para inscrições de Feiras Afiliadas
- 20/10/2025 (18h): Submissão completa de projetos
- 19/12/2025: Divulgação dos selecionados
- 16/03/2026: Credenciamento e montagem (USP)
- 17 a 19/03/2026: Mostra de Projetos
- 20/03/2026: Premiação e encerramento


==============================
REQUISITOS
==============================

- Escolaridade: 8º/9º ano, ensino médio ou técnico (2025)
- Idade: Máximo 20 anos até 01/05/2026
- Equipe: Até 3 estudantes
- Orientador: obrigatório (21+ anos)
- Coorientador: opcional (18+)
- Duração: até 12 meses (2025)

Documentos obrigatórios:
- Plano de Pesquisa
- Resumo (até 2000 caracteres)
- Relatório/Artigo (até 8 páginas)
- Diário de Bordo

Ética:
- Formulários extras para humanos, animais, DNA ou substâncias perigosas


==============================
ÁREAS FEBRACE (COM DEFINIÇÕES)
==============================

- Ciências Exatas e da Terra:
Projetos focados em matemática, algoritmos, computação, simulações, análise de dados, física e química.

Subáreas:
Matemática
Probabilidade e Estatística
Ciência da Computação
Astronomia
Física
Química
Geociências
Oceanografia


- Ciências Biológicas:
Projetos relacionados a seres vivos, organismos, células, genética, microbiologia e ecologia.

Subáreas:
Biologia Geral
Genética
Botânica
Zoologia
Ecologia
Morfologia
Fisiologia
Bioquímica
Biofísica
Farmacologia
Imunologia
Microbiologia
Parasitologia


- Ciências da Saúde:
Projetos focados na saúde humana, prevenção, tratamento e bem-estar.

Subáreas:
Medicina
Odontologia
Farmácia
Enfermagem
Nutrição
Saúde Coletiva
Fonoaudiologia
Fisioterapia e Terapia Ocupacional
Educação Física


- Ciências Agrárias:
Projetos voltados para agricultura, produção de alimentos, meio rural e recursos naturais.

Subáreas:
Agronomia
Recursos Florestais e Engenharia Florestal
Engenharia Agrícola
Zootecnia
Medicina Veterinária
Recursos Pesqueiros e Engenharia de Pesca
Ciência e Tecnologia de Alimentos


- Ciências Sociais Aplicadas:
Projetos sobre sociedade, economia, gestão, comunicação e comportamento social.

Subáreas:
Direito
Administração
Economia
Arquitetura e Urbanismo
Planejamento Urbano e Regional
Demografia
Ciência da Informação
Museologia
Comunicação
Serviço Social
Economia Doméstica
Desenho Industrial
Turismo


- Engenharias:
Projetos focados na aplicação prática de conhecimento científico para resolver problemas reais, construir ou otimizar sistemas físicos e industriais.

Subáreas:
Engenharia Civil
Engenharia de Minas
Engenharia de Materiais e Metalúrgica
Engenharia Elétrica
Engenharia Mecânica
Engenharia Química
Engenharia Sanitária
Engenharia de Produção
Engenharia Nuclear
Engenharia de Transportes
Engenharia Naval e Oceânica
Engenharia Aeroespacial
Engenharia Biomédica


- Ciências Humanas:
Projetos sobre comportamento humano, cultura, sociedade, educação e pensamento.

Subáreas:
Filosofia
Sociologia
Antropologia
Arqueologia
História
Geografia
Psicologia
Educação
Ciência Política
Teologia

REGRA CRÍTICA:

- O uso de matemática, estatística ou algoritmos NÃO define a área principal.

- Se a estatística for usada como ferramenta para estudar:
  - comportamento humano
  - sociedade
  - decisões
  - opinião pública

→ Classificar como:
Ciências Humanas ou Ciências Sociais Aplicadas

- Só classificar como Ciências Exatas quando o foco for:
  - desenvolver métodos matemáticos/estatísticos
  - teoria estatística

`;
let ola = `
CATEGORIAS MOSTRATEC
- Biologia Celular e Molecular
- Bioquímica e Química
- Ciências Ambientais
- Ciências Animais e de Plantas
- Ciências da Computação
- Ciências da Saúde
- Ciências Planetárias, Terrestres, Matemática e Física
- Educação e Humanidades
- Engenharia Ambiental e Sanitária
- Engenharia e Materiais
- Engenharia Elétrica
- Engenharia Eletrônica
- Engenharia Mecânica
- História e Ciências Sociais

PROJETOS DESTAQUE FEBRACE 2024
- Alimpar (CE): desinfecção UV com energia solar
- Ecofloor (AL): pisos com casca de sururu
- ConnectBreathe (SP): fisioterapia respiratória com gameterapia
- AgroSapiens (SE): robô agrícola com IA
- VAPER (RS): plataforma para empreendedores rurais

PROJETOS DESTAQUE MOSTRATEC 2024
1º: Educação e pensamento complexo (MA)
- Ensino interdisciplinar baseado em Edgar Morin

2º: RECIVERY (SC)
- Geolocalização de coleta seletiva

3º: Medicina na Bahia (BA)
- Distribuição de profissionais de saúde

4º: Poluição em águas gaúchas (RS)
- Cafeína, vírus e impacto ambiental

5º: Identificação de fungos (MS)
- Espectroscopia para pastagens


PROJETOS FEBRACE 2025
- Fotômetro com celular (MG)
- NANOTEC (BA): remoção de cobre da água
- Filtro com mucajá (PA)
- Sírius (SP): simulação de raios-X
- Coffee 3D (ES): filamento com borra de café

FINALISTAS MOSTRATEC 2025
- Larvicidas naturais contra Aedes aegypti (PR)
- L-Lactato e depressão (SC)
- Óleos vegetais para biodiesel (AM)
- App R&S 360 (BA)
- Alfavaca contra veneno (MA)
`;

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    enviarMensagem();
  }
});

async function enviarMensagem() {
  const userMessage = input.value.trim();
  if (userMessage === "") return;

  console.log("FUNCIONOU");

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "user");
  messageElement.textContent = userMessage;
  chatArea.appendChild(messageElement);
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
  if (primeiravez == true) {
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

  const aiElement = document.createElement("div");
  aiElement.classList.add("message", "bot");
  aiElement.textContent = "pensando...";
  chatArea.appendChild(aiElement);
  contexto = historico.slice(-10);
  console.log(contexto);
  try {
    const url = "/.netlify/functions/APIfunction";
    console.log("Chamando o backend...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Instrução: Você é o assistente da FEBRACE. 
                 Use estes dados oficiais: ${CONTEXTO_FEBRACE}
                 Pergunta: ${userMessage}`,
      }),
    });

    const data = await response.json();

    if (data.resposta) {
      const textoIA = data.resposta;

      aiElement.innerHTML = textoIA
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>");
    } else {
      aiElement.textContent = "Erro na resposta do backend.";
      console.log("Erro detalhado:", data);
    }
  } catch (erro) {
    aiElement.textContent = "Erro de conexão!";
    console.error("Erro no Fetch:", erro);
  }

  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
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
