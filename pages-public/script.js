const PORT = 3000;

function mostrarMenu() { /*função do menu mobile*/
  const menu = document.getElementById('listaMenu');

  // Se o menu está ativo (visível)
  if (menu.classList.contains('active')) {
    // Remove a classe 'active' para fechar o menu
    menu.classList.remove('active');
  } else {
    // Adiciona a classe 'active' para abrir o menu
    menu.classList.add('active');
  }
}
/*****função para api****/
function buscarCep() {
  const cep = document.getElementById('cepInput').value;

  fetch(`http://localhost:${PORT}/buscar?cep=${cep}`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        document.getElementById('resultado').innerHTML = `<p>${data.erro}</p>`;
        return;
      }

      const hospitaisHtml = data.hospitais_em_sp.map(hospital => {
        return `<li><strong>${hospital.nome}</strong> - Bairro: ${hospital.bairro}</li>`;
      }).join('');

      document.getElementById('resultado').innerHTML = `
        <p><strong>CEP:</strong> ${data.cep}</p>
        <p><strong>Cidade:</strong> ${data.cidade}</p>
        <p><strong>Bairro:</strong> ${data.bairro}</p>
        <p><strong>Estado:</strong> ${data.estado}</p>
        <h3>Hospitais Públicos em SP:</h3>
        <ul>${hospitaisHtml}</ul>
      `;
    })
    .catch(err => {
      document.getElementById('resultado').innerHTML = `<p>Erro ao buscar dados</p>`;
      console.error(err);
    });
}
