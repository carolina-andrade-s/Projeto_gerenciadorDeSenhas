// Gerenciador de Senhas
// Tudo roda no navegador. As senhas ficam no localStorage (só para estudo!).

const CHAVE_ARMAZENAMENTO = "senhasSalvas";

const LETRAS_MAIUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETRAS_MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%&*?+-_";

// Pegando os elementos da página
const campoSenhaGerada = document.getElementById("senhaGerada");
const campoTamanho = document.getElementById("tamanho");
const textoTamanho = document.getElementById("valorTamanho");
const campoSite = document.getElementById("site");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const mensagemVazia = document.getElementById("mensagemVazia");
const textoStatus = document.getElementById("status");

// Lista de senhas salvas (começa com o que já estava guardado)
let senhasSalvas = carregarSenhas();


// ---------- Gerar senha ----------

// Sorteia um número de 0 até (limite - 1) usando o sorteio seguro do navegador
function sortearNumero(limite) {
  const valores = new Uint32Array(1);
  crypto.getRandomValues(valores);
  return valores[0] % limite;
}

function gerarSenha() {
  // Junta os tipos de caractere que a pessoa marcou
  let caracteres = "";
  if (document.getElementById("usarMaiusculas").checked) caracteres += LETRAS_MAIUSCULAS;
  if (document.getElementById("usarMinusculas").checked) caracteres += LETRAS_MINUSCULAS;
  if (document.getElementById("usarNumeros").checked) caracteres += NUMEROS;
  if (document.getElementById("usarSimbolos").checked) caracteres += SIMBOLOS;

  if (caracteres === "") {
    mostrarStatus("Marque pelo menos uma opção para gerar a senha.");
    return;
  }

  const tamanho = Number(campoTamanho.value);
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += caracteres[sortearNumero(caracteres.length)];
  }

  campoSenhaGerada.value = senha;
  campoSenha.value = senha; // já deixa pronta no formulário
  mostrarStatus("Senha gerada!");
}


// ---------- Salvar e carregar ----------

function carregarSenhas() {
  const texto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function guardarSenhas() {
  localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(senhasSalvas));
}

function salvarNovaSenha(evento) {
  evento.preventDefault(); // não deixa a página recarregar

  senhasSalvas.push({
    id: Date.now(),
    site: campoSite.value.trim(),
    usuario: campoUsuario.value.trim(),
    senha: campoSenha.value,
    visivel: false,
  });

  guardarSenhas();
  formulario.reset();
  mostrarLista();
  mostrarStatus("Senha salva!");
}

function excluirSenha(id) {
  senhasSalvas = senhasSalvas.filter(function (item) {
    return item.id !== id;
  });
  guardarSenhas();
  mostrarLista();
  mostrarStatus("Senha excluída.");
}

function alternarVisibilidade(id) {
  const item = senhasSalvas.find(function (item) {
    return item.id === id;
  });
  item.visivel = !item.visivel;
  mostrarLista();
}


// ---------- Mostrar na tela ----------

function criarBotao(texto, aoClicar, classe) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  if (classe) botao.className = classe;
  botao.addEventListener("click", aoClicar);
  return botao;
}

function mostrarLista() {
  lista.innerHTML = "";
  mensagemVazia.hidden = senhasSalvas.length > 0;

  senhasSalvas.forEach(function (item) {
    const linha = document.createElement("li");

    const site = document.createElement("div");
    site.className = "item-site";
    site.textContent = item.site;

    const usuario = document.createElement("div");
    usuario.className = "item-usuario";
    usuario.textContent = item.usuario;

    const senha = document.createElement("div");
    senha.className = "item-senha";
    senha.textContent = item.visivel ? item.senha : "••••••••";

    const botoes = document.createElement("div");
    botoes.className = "item-botoes";
    botoes.appendChild(criarBotao(item.visivel ? "Ocultar" : "Mostrar", function () {
      alternarVisibilidade(item.id);
    }));
    botoes.appendChild(criarBotao("Copiar senha", function () {
      copiarTexto(item.senha);
    }));
    botoes.appendChild(criarBotao("Excluir", function () {
      excluirSenha(item.id);
    }, "perigo"));

    linha.append(site, usuario, senha, botoes);
    lista.appendChild(linha);
  });
}

function mostrarStatus(mensagem) {
  textoStatus.textContent = mensagem;
}

async function copiarTexto(texto) {
  if (texto === "") {
    mostrarStatus("Não há nada para copiar.");
    return;
  }
  try {
    await navigator.clipboard.writeText(texto);
    mostrarStatus("Copiado!");
  } catch (erro) {
    mostrarStatus("Não foi possível copiar. Selecione o texto e copie manualmente.");
  }
}


// ---------- Ligando os botões ----------

document.getElementById("botaoGerar").addEventListener("click", gerarSenha);

document.getElementById("botaoCopiarGerada").addEventListener("click", function () {
  copiarTexto(campoSenhaGerada.value);
});

campoTamanho.addEventListener("input", function () {
  textoTamanho.textContent = campoTamanho.value;
});

formulario.addEventListener("submit", salvarNovaSenha);

// Mostra a lista assim que a página abre
mostrarLista();
