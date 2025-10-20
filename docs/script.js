/************* MENU MOBILE *************/
function mostrarMenu() {
  const menu = document.getElementById('listaMenu');

  if (menu.classList.contains('active')) {
    menu.classList.remove('active'); // fecha o menu
  } else {
    menu.classList.add('active'); // abre o menu
  }
}
window.mostrarMenu = mostrarMenu; // torna a função globalmente acessível

/************* MAPA E HOSPITAIS *************/
let map;
let geocoder;
let infoWindow;

// Lista das unidades fixas
const unidades = [
  {
    nome: "Unidade Leste",
    endereco: "R. Ulisses Cruz, 285 - Tatuapé, São Paulo - SP",
    lat: -23.540908,
    lng: -46.561853
  },
  {
    nome: "Unidade Norte",
    endereco: "Av. Santa Inês, 1500 - Santana, São Paulo - SP",
    lat: -23.474215,
    lng: -46.633672
  },
  {
    nome: "Unidade Sul",
    endereco: "Av. Adolfo Pinheiro, 911 - Santo Amaro, São Paulo - SP",
    lat: -23.654345,
    lng: -46.701176
  }
];

// Inicializa o mapa
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -23.55052, lng: -46.633308 },
    zoom: 11,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#0b1e33" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#12263f" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c3357" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] }
    ]
  });

  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();

  // Adiciona marcadores das unidades
  unidades.forEach((u) => {
    const marker = new google.maps.Marker({
      position: { lat: u.lat, lng: u.lng },
      map: map,
      title: u.nome
    });

    marker.addListener("click", () => {
      infoWindow.setContent(`
        <div style="color:black; font-weight:bold;">
          ${u.nome}<br>${u.endereco}
        </div>
      `);
      infoWindow.open(map, marker);
    });
  });
}

// Função chamada ao enviar o CEP
function buscarCep() {
  const cep = document.getElementById("cepInput").value.replace(/\D/g, "");

  if (cep.length !== 8) {
    alert("Digite um CEP válido!");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

      geocoder.geocode({ address: endereco }, (results, status) => {
        if (status === "OK" && results[0]) {
          const localizacaoUsuario = results[0].geometry.location;

          let unidadeMaisProxima = null;
          let menorDistancia = Infinity;

          unidades.forEach((u) => {
            const distancia = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(u.lat, u.lng),
              localizacaoUsuario
            );
            if (distancia < menorDistancia) {
              menorDistancia = distancia;
              unidadeMaisProxima = u;
            }
          });

          map.setCenter({ lat: unidadeMaisProxima.lat, lng: unidadeMaisProxima.lng });
          map.setZoom(14);

          infoWindow.setContent(`
            <div style="color:black; font-weight:bold;">
              ${unidadeMaisProxima.nome}<br>${unidadeMaisProxima.endereco}
            </div>
          `);
          infoWindow.setPosition({ lat: unidadeMaisProxima.lat, lng: unidadeMaisProxima.lng });
          infoWindow.open(map);

        } else {
          alert("Não foi possível localizar o CEP informado.");
        }
      });
    })
    .catch(() => alert("Erro ao buscar o CEP!"));
}


