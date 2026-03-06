let perguntas = [
  {
    texto: "Quantos banhos você toma por dia?",
    opcoes: ["1", "2", "3", "4 ou mais"],
  },

  {
    texto: "Quantos dias por mês você usa carro?",
    opcoes: ["1 a 7 dias", "8 a 14 dias", "15 a 21 dias", "22 a 30 dias"],
  },

  {
    texto: "Quantas peças de roupa você compra por mês?",
    opcoes: ["0 a 2 peças", "3 a 5 peças", "6 a 10 peças", "Mais de 10"],
  },

  {
    texto: "Com que frequência você troca de celular?",
    opcoes: [
      "A cada 5 anos ou mais",
      "A cada 3 a 4 anos",
      "A cada 2 anos",
      "Todo ano",
    ],
  },

  {
    texto: "Você usa ar condicionado em casa?",
    opcoes: [
      "Nunca",
      "Alguns dias no mês",
      "Vários dias na semana",
      "Todos os dias",
    ],
  },
];

let perguntasSelecionadas = [];
let respostas = [];
let indice = 0;

// iniciar automaticamente
window.onload = () => {
  perguntasSelecionadas = perguntas;
  mostrarPergunta();
};

function mostrarPergunta() {
  let pergunta = perguntasSelecionadas[indice];

  document.getElementById("perguntaTexto").innerText = pergunta.texto;

  let opcoesHTML = "";

  pergunta.opcoes.forEach((opcao) => {
    opcoesHTML += `<button onclick="responder('${opcao}')">${opcao}</button>`;
  });

  document.getElementById("opcoes").innerHTML = opcoesHTML;
}

function responder(resposta) {
  respostas.push(resposta);

  let tela = document.getElementById("perguntas");

  tela.classList.add("fade-out");

  setTimeout(() => {
    indice++;

    if (indice >= perguntasSelecionadas.length) {
      mostrarResultado();
      return;
    }

    mostrarPergunta();

    tela.classList.remove("fade-out");
  }, 1500);
}

function mostrarResultado() {
  let telaPerguntas = document.getElementById("perguntas");
  let telaResultado = document.getElementById("resultado");

  telaPerguntas.classList.add("hidden");

  telaResultado.classList.remove("hidden");

  // força o navegador a aplicar display antes da animação
  setTimeout(() => {
    telaResultado.classList.add("show");
  }, 50);

  let impacto = calcularImpactoUsuario();

  let total =
    impacto.banho +
    impacto.transporte +
    impacto.consumo +
    impacto.energia +
    impacto.tecnologia;

  criarGraficoUsuario(impacto);
  criarGraficoIndustria();

  mostrarDadosUsuario(impacto);
  mostrarDadosIndustria();

  mostrarComparacao(total);
}

function calcularImpactoUsuario() {
  let banho = 0;
  let transporte = 0;
  let consumo = 0;
  let energia = 0;
  let tecnologia = 0;

  respostas.forEach((r) => {
    if (r === "1" || r === "2" || r === "3" || r === "4 ou mais") {
      let mapa = {
        1: 0.3,
        2: 0.6,
        3: 0.9,
        "4 ou mais": 1.2,
      };

      banho = mapa[r] || 0;
    }

    if (r.includes("dias")) {
      let mapa = {
        "1 a 7 dias": 0.5,
        "8 a 14 dias": 1.2,
        "15 a 21 dias": 2,
        "22 a 30 dias": 3,
      };

      transporte = mapa[r] || 0;
    }

    if (r.includes("peças")) {
      let mapa = {
        "0 a 2 peças": 0.2,
        "3 a 5 peças": 0.5,
        "6 a 10 peças": 1,
        "Mais de 10": 2,
      };

      consumo = mapa[r] || 0;
    }

    if (
      r === "Nunca" ||
      r === "Alguns dias no mês" ||
      r === "Vários dias na semana" ||
      r === "Todos os dias"
    ) {
      let mapa = {
        Nunca: 0.2,
        "Alguns dias no mês": 0.5,
        "Vários dias na semana": 1,
        "Todos os dias": 1.8,
      };

      energia = mapa[r] || 0;
    }

    if (
      r === "A cada 5 anos ou mais" ||
      r === "A cada 3 a 4 anos" ||
      r === "A cada 2 anos" ||
      r === "Todo ano"
    ) {
      let mapa = {
        "A cada 5 anos ou mais": 0.2,
        "A cada 3 a 4 anos": 0.5,
        "A cada 2 anos": 1,
        "Todo ano": 1.8,
      };

      tecnologia = mapa[r] || 0;
    }
  });

  return {
    banho,
    transporte,
    consumo,
    energia,
    tecnologia,
  };
}

function criarGraficoUsuario(impacto) {
  let ctx = document.getElementById("graficoUsuario");

  new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: ["Banhos", "Transporte", "Consumo", "Energia", "Tecnologia"],

      datasets: [
        {
          data: [
            impacto.banho || 0,
            impacto.transporte || 0,
            impacto.consumo || 0,
            impacto.energia || 0,
            impacto.tecnologia || 0,
          ],

          backgroundColor: [
            "#4FC3F7",
            "#FF7043",
            "#66BB6A",
            "#AB47BC",
            "#FFD54F",
          ],
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          labels: { color: "white" },
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              let valor = context.raw || 0;
              return valor.toFixed(2) + " T/A";
            },
          },
        },
      },
    },
  });
}
function mostrarDadosUsuario(impacto) {
  let div = document.querySelector(".dadosUsuario");

  div.innerHTML = `
<h3>Seu impacto estimado</h3>

<ul>
<li>🚿 Banhos: ${impacto.banho.toFixed(2)} t CO₂ / ano</li>
<li>🚗 Transporte: ${impacto.transporte.toFixed(2)} t CO₂ / ano</li>
<li>🛍 Consumo: ${impacto.consumo.toFixed(2)} t CO₂ / ano</li>
<li>❄ Energia: ${impacto.energia.toFixed(2)} t CO₂ / ano</li>
<li>📱 Tecnologia: ${impacto.tecnologia.toFixed(2)} t CO₂ / ano</li>
</ul>
`;
}
function mostrarDadosIndustria() {
  let div = document.querySelector(".dadosIndustria");

  div.innerHTML = `
<h3>Grandes emissores globais</h3>

<ul>
<li>👕 Indústria têxtil: ~1.2 bilhão toneladas CO₂/ano</li>
<li>💻 Indústria tecnológica: ~900 milhões toneladas CO₂/ano</li>
<li>🌾 Agronegócio global: ~1.5 bilhão toneladas CO₂/ano</li>
<li>🏭 Outras indústrias: ~800 milhões toneladas CO₂/ano</li>
</ul>
`;
}
function mostrarComparacao(total) {
  let comparacao = document.getElementById("comparacao");

  comparacao.innerHTML = `
<p>
Seu impacto anual estimado é de <b>${total.toFixed(2)} toneladas de CO₂</b>.
</p>


<p>
A indústria têxtil global emite aproximadamente <b>1.2 bilhão de toneladas de CO₂ por ano</b>.
</p>

<p>
A indústria tecnológica gera cerca de <b>900 milhões de toneladas de CO₂ por ano</b>.
</p>

<p>
O agronegócio global é responsável por aproximadamente 
<b>1.5 bilhão de toneladas de CO₂ por ano</b>.
</p>

<p>
Outras indústrias pesadas, como produção de aço e cimento,
somam cerca de <b>800 milhões de toneladas de CO₂ por ano</b>.
</p>

<p>
Ou seja, mesmo que você reduzisse seu impacto a zero,
isso representaria menos de <b>0.0000002%</b> do problema global.
</p>

<p>
Grandes indústrias como <b>moda rápida, tecnologia e agronegócio</b>
são responsáveis por uma parcela muito maior das emissões.
</p>
<p>
Enquanto indivíduos podem reduzir seu impacto, mudanças estruturais na indústria são essenciais para reduzir emissões em escala global
</p>
<h3>Consumo, economia e meio ambiente</h3>
Durante muito tempo fomos levados a acreditar que o grande vilão do meio ambiente somos nós, indivíduos comuns. Porém, na realidade, grande parte da destruição ambiental é causada por enormes indústrias que exploram recursos naturais para sustentar um modelo de consumo desenfreado — muitas vezes incentivado pelas próprias empresas.

Como sociedade, precisamos nos perguntar até que ponto vale continuar alimentando esse sistema. Até que ponto vale trocar o futuro do planeta por um presente de consumo rápido, onde nossos próprios filhos podem sofrer as consequências de um mundo cada vez mais degradado.

Grandes empresas frequentemente anunciam projetos de “compensação ambiental”, prometendo devolver à natureza aquilo que retiram. No entanto, na prática, essas ações raramente conseguem reparar a dimensão real dos danos causados ao meio ambiente.
`;
}
function criarGraficoIndustria() {
  let ctx = document.getElementById("graficoIndustria");

  new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: [
        "Indústria Têxtil",
        "Indústria Tecnológica",
        "Agronegócio",
        "Outras indústrias",
      ],

      datasets: [
        {
          data: [1200, 900, 1500, 800],

          backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#8bc34a"],
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          labels: { color: "white" },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.raw + " Mt CO₂ / ano";
            },
          },
        },
      },
    },
  });
}
