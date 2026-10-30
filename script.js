const perfis = [
  {
    id: 1,
    nome: "Exterminador de Ameaças",
    categoria: "Segurança e Combate",
    descricao: "Você é a linha de frente. Não teme o desconhecido e está sempre pronto para proteger a tripulação de qualquer criatura ou perigo alienígena.",
    recomendacao: "Sua missão é liderar a defesa da equipe durante as explorações e garantir que todos voltem vivos para a nave.",
    imagem: "imagens/colosso-aura.jpg" 
  },
  {
    id: 2,
    nome: "Cientista de Matéria Alienígena",
    categoria: "Pesquisa e Análise",
    descricao: "Curiosidade é o seu sobrenome. Você prefere investigar, catalogar e entender a composição de tudo o que encontram no novo planeta.",
    recomendacao: "Você será o responsável por analisar as amostras coletadas e descobrir se o planeta é seguro ou se esconde riscos biológicos.",
    imagem: "imagens/ricky-aura.png" 
  },
  {
    id: 3,
    nome: "Piloto Espacial",
    categoria: "Navegação",
    descricao: "O espaço é o seu lar. Você tem reflexos rápidos, ama a adrenalina de uma boa manobra evasiva e sabe como tirar a nave de qualquer enrascada.",
    recomendacao: "Mantenha os motores aquecidos. Quando a situação ficar perigosa, você será o único capaz de fazer a nave escapar em alta velocidade.",
    imagem: "imagens/hansolo-aura.png" 
  },
  {
    id: 4,
    nome: "Engenheiro de Manutenção",
    categoria: "Construção e Suporte",
    descricao: "Você é o coração mecânico da missão. Gosta de resolver problemas práticos, sujar as mãos e garantir que nada falhe no meio do caminho.",
    recomendacao: "Você ficará responsável por manter os sistemas de suporte de vida, os motores e as armas da nave sempre em perfeito estado.",
    imagem: "imagens/franky-aura.png" 
  },
  {
    id: 5,
    nome: "Líder Estrategista",
    categoria: "Comando",
    descricao: "Você pensa no coletivo. Sabe organizar equipes, delegar tarefas e manter a calma sob pressão, transformando o caos em um plano de ação claro.",
    recomendacao: "Assuma o comando da base e coordene as tarefas. Sua visão estratégica será essencial para a sobrevivência a longo prazo.",
    imagem: "imagens/capitao-aura.png" 
  }
];

const form            = document.getElementById("form-perfil");
const campoNome       = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");

const modalErro       = document.getElementById("modal-erro");
const textoErro       = document.getElementById("texto-erro");
const btnFecharErro   = document.getElementById("btn-fechar-erro");

const secaoResultado  = document.getElementById("resultado");
const secaoEmpate     = document.getElementById("tela-empate");
const empateMensagem  = document.getElementById("empate-mensagem");
const botoesEmpate    = document.getElementById("botoes-empate");

const botaoRefazer    = document.getElementById("btn-refazer");

let dadosPendentes = { nome: "", idade: 0 };

function mostrarErro(mensagem) {
  textoErro.textContent = mensagem;
  modalErro.classList.remove("escondido");
}

btnFecharErro.addEventListener("click", function () {
  modalErro.classList.add("escondido");
});

(function limitarData() {
  const hoje = new Date();
  const iso = hoje.getFullYear() + "-" +
    String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
    String(hoje.getDate()).padStart(2, "0");
  campoNascimento.max = iso;
})();

function calcularIdade(nascimento) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const diferencaMes = hoje.getMonth() - nascimento.getMonth();
  if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  
  modalErro.classList.add("escondido");

  const nome = campoNome.value.trim();
  const dataNascimento = campoNascimento.value;

  if (nome.length < 1) {
    mostrarErro("Digite o seu nome para continuar.");
    campoNome.focus();
    return;
  }

  if (!dataNascimento) {
    mostrarErro("Informe a sua data de nascimento para calcularmos a idade.");
    campoNascimento.focus();
    return;
  }

  const nascimento = new Date(dataNascimento + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (isNaN(nascimento.getTime()) || nascimento > hoje) {
    mostrarErro("Data de nascimento inválida ou no futuro. Confira os dados.");
    campoNascimento.focus();
    return;
  }

  const idade = calcularIdade(nascimento);
  
  if (idade < 18) {
    mostrarErro("Acesso negado: A tripulação da Missão Aura exige idade mínima de 18 anos.");
    campoNascimento.focus();
    return;
  }

  const pontos = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (let numero = 1; numero <= 5; numero++) {
    const marcada = form.querySelector('input[name="q' + numero + '"]:checked');
    if (!marcada) {
      mostrarErro("Responda a pergunta " + numero + " antes de descobrir o perfil.");
      return;
    }
    pontos[Number(marcada.value)] += 1;
  }

  const maiorPontuacao = Math.max(pontos[1], pontos[2], pontos[3], pontos[4], pontos[5]);
  
  const perfisEmpatados = perfis.filter(function (p) {
    return pontos[p.id] === maiorPontuacao;
  });

  if (perfisEmpatados.length > 1) {
    dadosPendentes = { nome: nome, idade: idade };
    mostrarTelaEmpate(perfisEmpatados);
  } else {
    exibirResultado(nome, idade, perfisEmpatados[0]);
  }
});

function mostrarTelaEmpate(empatados) {
  form.classList.add("escondido");
  secaoResultado.classList.add("escondido");
  secaoEmpate.classList.remove("escondido");

  empateMensagem.innerHTML = `Atenção, candidato(a) <strong>${dadosPendentes.nome}</strong>. 
    Nossos algoritmos de varredura neural identificaram um perfil de alto desempenho com habilidades híbridas. 
    Você possui capacidade comprovada para exercer <strong>duas (ou mais) funções essenciais</strong> na tripulação.<br><br>
    A Diretoria da Missão Aura autoriza a sua escolha. <strong>Qual cargo você deseja ocupar?</strong>`;

  botoesEmpate.innerHTML = "";

  empatados.forEach(function (perfil) {
    const btn = document.createElement("button");
    btn.className = "btn-empate";
    btn.innerHTML = `
      <strong>${perfil.nome}</strong>
      <span>${perfil.categoria}</span>
    `;
    
    btn.addEventListener("click", function() {
      exibirResultado(dadosPendentes.nome, dadosPendentes.idade, perfil);
    });

    botoesEmpate.appendChild(btn);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exibirResultado(nome, idade, perfil) {
  document.getElementById("participante").textContent =
    "Tripulante: " + nome + " · " + idade + (idade === 1 ? " ano" : " anos");

  document.getElementById("perfil-nome").textContent        = perfil.nome;
  document.getElementById("perfil-categoria").textContent   = perfil.categoria;
  document.getElementById("perfil-descricao").textContent   = perfil.descricao;
  document.getElementById("perfil-recomendacao").textContent = perfil.recomendacao;

  const img = document.getElementById("perfil-img");
  img.src = perfil.imagem;
  img.alt = "Imagem do perfil " + perfil.nome;

  form.classList.add("escondido");
  secaoEmpate.classList.add("escondido");
  secaoResultado.classList.remove("escondido");
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

botaoRefazer.addEventListener("click", function () {
  form.reset();
  modalErro.classList.add("escondido");
  
  secaoResultado.classList.add("escondido");
  secaoEmpate.classList.add("escondido");
  form.classList.remove("escondido");
  
  window.scrollTo({ top: 0, behavior: "smooth" });
  campoNome.focus();
});