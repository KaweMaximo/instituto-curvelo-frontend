/**
 * router.js - roteador da SPA baseado em hash (#/rota/parametro).
 * Hash funciona em qualquer hospedagem estática (sem configurar o servidor)
 * e mantém os botões Voltar/Avançar do navegador funcionando.
 */
import { renderizar } from './templates.js';
import { marcarLinkAtivo } from './ui.js';
import * as views from './views.js';

const ROTAS = {
  inicio: views.inicio,
  projetos: (param) => (param ? views.projeto(param) : views.projetos()),
  cadastro: views.cadastro,
  'meus-cadastros': views.meusCadastros,
  privacidade: views.privacidade
};

const NOME_SITE = 'Instituto Curvelo';

function lerRota() {
  const [base = 'inicio', param] = location.hash.replace(/^#\/?/, '').split('/');
  return { base: base || 'inicio', param };
}

function navegar() {
  if (location.hash && !location.hash.startsWith('#/')) return; // âncoras internas não são rotas
  const { base, param } = lerRota();
  const fabrica = ROTAS[base];
  const view = fabrica ? fabrica(param) : views.naoEncontrada();

  const raiz = document.getElementById('conteudo');
  renderizar(raiz, `<div class="view">${view.conteudo}</div>`);
  if (view.montar) view.montar(raiz.firstElementChild);

  document.title = `${view.titulo} | ${NOME_SITE}`;
  marcarLinkAtivo(base);
  window.scrollTo(0, 0);
  // Leva o foco ao título: o leitor de tela anuncia a nova "página"
  const titulo = raiz.querySelector('[data-titulo-view]');
  if (titulo && primeiraCargaFeita) titulo.focus({ preventScroll: true });
  primeiraCargaFeita = true;
}

let primeiraCargaFeita = false;

export function iniciarRoteador() {
  window.addEventListener('hashchange', navegar);
  if (!location.hash) history.replaceState(null, '', '#/inicio');
  navegar();
}
