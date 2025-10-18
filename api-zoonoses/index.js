//meu server
const express = require('express'); /*framework para criar servidores e rotas HTTP.*/
const axios = require('axios'); /*biblioteca para fazer requisições HTTP (usada para consultar a BrasilAPI)*/
const cors = require('cors'); /*permite que seu site (em outro domínio ou porta) acesse sua API sem bloqueio*/
const path = require('path');


const app = express();
const PORT = 3000; /*define a porta onde sua API vai rodar localmente (http://localhost:3000)*/

// Definir endpoints
app.use(express.static(path.join(__dirname, '../pages-public/')));
app.use(express.static(path.join(__dirname, '../')));

app.use(cors()); // Sem parâmetros aí todas as origens são aceitas

// Definir endpoint padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages-public/index.html'));
});

// Dados fictícios dos hospitais públicos veterinários
const hospitais = [ /*dados*/
  { nome: "Hospital Veterinário Zona Norte", bairro: "Vila Nova Cachoeirinha" },
  { nome: "Hospital Veterinário Zona Sul", bairro: "Capão Redondo" },
  { nome: "Hospital Veterinário Zona Leste", bairro: "Tatuapé" },
  { nome: "Hospital Veterinário Zona Oeste", bairro: "Vila Sônia" }
];

// Rota para buscar dados com base no CEP
app.get('/buscar', cors(), async (req, res) => {
  const cep = req.query.cep;
  if (!cep) return res.status(400).json({ erro: 'CEP não informado' });

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const { city, neighborhood, state } = response.data;

    if (city !== 'São Paulo') {
      return res.status(404).json({ erro: 'CEP fora de São Paulo' });
    }
    const hospitaisFiltrados = hospitais.filter(hospital =>
      hospital.bairro.toLowerCase() === neighborhood.toLowerCase());

    res.json({
      cep,
      cidade: city,
      bairro: neighborhood,
      estado: state,
      hospitais_em_sp: hospitaisFiltrados
    });
  } catch (error) {
    console.error("Erro ao buscar CEP:", error.message); /*Assim, se algo falhar, o terminal mostrará o motivo real*/
    res.status(500).json({ erro: 'Erro ao buscar CEP', detalhes: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` API atulizada rodando em http://localhost:${PORT}`);
});
