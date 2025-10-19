let map;
let geocoder;

// Menu mobile
function mostrarMenu() {
  const menu = document.getElementById('listaMenu');
  menu.classList.toggle('active');
}

// Inicializa o mapa
function initMap() {
  // Inicializa mapa e geocoder globais
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: -23.5505, lng: -46.6333 }, // Centro de São Paulo
    styles: [
      { elementType: "geometry", stylers: [{ color: "#0a0f1a" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#8ab4f8" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0a0f1a" }] },
      { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1c2a48" }] },
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#12233b" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#102030" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#1a2b4c" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f1a2d" }] },
      { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#243b6b" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1733" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4f70a1" }] },
    ],
  });

  geocoder = new google.maps.Geocoder();

  // Adiciona os hospitais fixos
  adicionarHospitais();
}

// Lista dos hospitais públicos
const hospitais = [
  {
    nome: "Unidade Oeste - USP",
    endereco: "Av. Professor Orlando Marques de Paiva, 87 – Butantã",
    posicao: { lat: -23.5614, lng: -46.7376 },
  },
  {
    nome: "Unidade Norte - Casa Verde",
    endereco: "Rua Atílio Piffer, 687 - Casa Verde",
    posicao: { lat: -23.4947, lng: -46.6575 },
  },
  {
    nome: "Unidade Sul - Jurubatuba",
    endereco: "Rua Agostino Togneri, 153 - Jurubatuba",
    posicao: { lat: -23.6813, lng: -46.6991 },
  },
  {
    nome: "Unidade Leste - Tatuapé",
    endereco: "R. Ulisses Cruz, 285 - Tatuapé",
    posicao: { lat: -23.5403, lng: -46.5677 },
  },
];

// Adiciona marcadores dos hospitais
function adicionarHospitais() {
  hospitais.forEach((hospital) => {
    const marker = new google.maps.Marker({
      position: hospital.posicao,
      map,
      title: hospital.nome,
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="color: #000; font-size: 14px; line-height: 1.5; max-width: 220px;">
          <strong style='color:#000; font-weight:700;'>${hospital.nome}</strong><br>
          ${hospital.endereco}
        </div>
      `,
    });

    marker.addListener("click", () => {
      info.open(map, marker);
    });

    // Salva o marker e o info dentro do objeto hospital
    hospital.marker = marker;
    hospital.info = info;
  });
}

// Calcula distância entre dois pontos (em km)
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Buscar CEP e mostrar hospital mais próximo
function buscarCEP() {
  const cep = document.getElementById('cepInput').value.trim();
  if (!cep) {
    alert("Por favor, insira um CEP válido.");
    return;
  }

  if (!map || !geocoder) {
    alert("O mapa ainda está carregando, aguarde alguns segundos.");
    return;
  }

  geocoder.geocode({ address: `${cep}, São Paulo, SP` }, (results, status) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      // Encontra o hospital mais próximo
      let hospitalMaisProximo = null;
      let menorDistancia = Infinity;

      hospitais.forEach((hospital) => {
        const dist = calcularDistancia(lat, lng, hospital.posicao.lat, hospital.posicao.lng);
        if (dist < menorDistancia) {
          menorDistancia = dist;
          hospitalMaisProximo = hospital;
        }
      });

      if (hospitalMaisProximo) {
        map.setCenter(hospitalMaisProximo.posicao);
        map.setZoom(14);

        // Abre automaticamente a infoWindow do hospital mais próximo
        hospitalMaisProximo.info.open(map, hospitalMaisProximo.marker);
      }

    } else {
      alert("CEP inválido ou não encontrado.");
      console.error("Erro ao localizar CEP:", status);
    }
  });
}
