export function mostrarMenu() {
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
