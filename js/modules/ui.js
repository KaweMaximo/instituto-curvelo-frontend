/**
 * ui.js - componentes de interface globais: menu, submenu, toast e modal.
 */

/* ---------- Toast ---------- */
let temporizadorToast;
export function mostrarToast(texto) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = texto;               // role="status" faz o leitor de tela anunciar
  toast.classList.add('toast--visivel');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => toast.classList.remove('toast--visivel'), 5000);
}

/* ---------- Modal de confirmação (retorna uma Promise<boolean>) ---------- */
export function confirmar({ titulo, texto, rotuloConfirmar = 'Confirmar', rotuloCancelar = 'Cancelar' }) {
  const modal = document.getElementById('modal');
  if (!modal || typeof modal.showModal !== 'function') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${texto}`)); // navegador antigo
  }
  modal.querySelector('#modal-titulo').textContent = titulo;
  modal.querySelector('#modal-texto').textContent = texto;
  modal.querySelector('#modal-confirmar').textContent = rotuloConfirmar;
  modal.querySelector('#modal-cancelar').textContent = rotuloCancelar;
  modal.returnValue = '';
  modal.showModal();                        // prende o foco e fecha com Esc
  return new Promise((resolver) => {
    modal.addEventListener('close', () => resolver(modal.returnValue === 'confirmar'), { once: true });
  });
}

/* ---------- Menu hambúrguer e submenu ---------- */
export function iniciarMenu() {
  const botao = document.querySelector('.menu__botao');
  const lista = document.getElementById('menu-principal');
  const botoesSub = document.querySelectorAll('.submenu__botao');

  const definirMenu = (aberto) => {
    botao.setAttribute('aria-expanded', String(aberto));
    botao.querySelector('.menu__texto').textContent = aberto ? 'Fechar' : 'Menu';
    lista.classList.toggle('menu__lista--aberta', aberto);
  };
  const fecharSubmenus = (exceto) =>
    botoesSub.forEach((b) => { if (b !== exceto) b.setAttribute('aria-expanded', 'false'); });

  botao.addEventListener('click', () => definirMenu(botao.getAttribute('aria-expanded') !== 'true'));

  botoesSub.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const aberto = b.getAttribute('aria-expanded') === 'true';
    fecharSubmenus(b);
    b.setAttribute('aria-expanded', String(!aberto));
  }));

  document.addEventListener('click', () => fecharSubmenus());
  // Fecha o submenu quando o foco do teclado sai do item (Tab além do último link)
  document.querySelectorAll('.menu__item--submenu').forEach((item) => {
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        item.querySelector('.submenu__botao').setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    botoesSub.forEach((b) => {
      if (b.getAttribute('aria-expanded') === 'true') { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    });
    if (botao.getAttribute('aria-expanded') === 'true') { definirMenu(false); botao.focus(); }
  });

  // Ao navegar para outra view, fecha menu e submenus
  window.addEventListener('hashchange', () => { definirMenu(false); fecharSubmenus(); });
  window.matchMedia('(min-width: 48em)').addEventListener('change', (mq) => { if (mq.matches) definirMenu(false); });
}

/** Marca no menu o link da rota atual com aria-current="page". */
export function marcarLinkAtivo(caminhoBase) {
  document.querySelectorAll('.menu__link').forEach((link) => {
    const ativo = link.getAttribute('href') === `#/${caminhoBase}`;
    if (ativo) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
