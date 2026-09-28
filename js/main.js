/**
 * main.js - ponto de entrada da aplicação.
 * Só orquestra: cada responsabilidade vive em um módulo de js/modules/.
 */
import { iniciarMenu } from './modules/ui.js';
import { iniciarRoteador } from './modules/router.js';
import { atualizarContador } from './modules/contador.js';

document.documentElement.classList.replace('no-js', 'js');

// O link "Pular para o conteúdo" usaria #conteudo, que o roteador confundiria
// com uma rota. Aqui ele move o foco sem alterar o hash.
document.querySelector('.pular-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('conteudo').focus();
});

iniciarMenu();
atualizarContador();
iniciarRoteador();

// Mantém o contador certo se outra aba alterar o localStorage
window.addEventListener('storage', atualizarContador);
