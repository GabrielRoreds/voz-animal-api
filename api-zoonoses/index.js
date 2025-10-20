const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Dados fictícios dos hospitais públicos veterinários
const hospitais = [
  { nome: "Hospital Veterinário Zona Norte", bairro: "Vila Nova Cachoeirinha" },
  { nome: "Hospital Veterinário Zona Sul", bairro: "Capão Redondo" },
  { nome: "Hospital Veterinário Zona Leste", bairro: "Tatuapé" },
  { nome: "Hospital Veterinário Zona Oeste", bairro: "Vila Sônia" }
];

// Rota para buscar dados com base no CEP
app.get('/buscar', async (req, res) => {
  const cep = req.query.cep;
  if (!cep) return res.status(400).json({ erro: 'CEP não informado' });

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const { city, neighborhood, state } = response.data;

    if (city !== 'São Paulo') {
      return res.status(404).json({ erro: 'CEP fora de São Paulo' });
    }

    const hospitaisFiltrados = hospitais.filter(h =>
      h.bairro.toLowerCase() === neighborhood.toLowerCase()
    );

    return res.json({
      cep,
      cidade: city,
      bairro: neighborhood,
      estado: state,
      hospitais_em_sp: hospitaisFiltrados
    });
  } catch (error) {
    console.error("❌ Erro ao buscar CEP:", error.message);
    return res.status(500).json({ erro: 'Erro ao buscar dados do CEP.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
