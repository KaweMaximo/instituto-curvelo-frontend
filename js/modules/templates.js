/**
 * templates.js - sistema de templates com template literals.
 *
 * A tag html`...` monta strings de HTML e ESCAPA automaticamente tudo o que
 * é interpolado. Assim, um nome digitado como <script> no formulário aparece
 * como texto, nunca como código (proteção contra XSS). Trechos que já são
 * HTML gerado por outro template passam sem escape porque são HtmlSeguro.
 */
class HtmlSeguro {
  constructor(texto) { this.texto = texto; }
  toString() { return this.texto; }
}

const MAPA_ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (c) => MAPA_ESCAPE[c]);
}

function converter(valor) {
  if (valor === null || valor === undefined || valor === false) return '';
  if (valor instanceof HtmlSeguro) return valor.texto;
  if (Array.isArray(valor)) return valor.map(converter).join('');
  return escapar(valor);
}

export function html(partes, ...valores) {
  let saida = partes[0];
  valores.forEach((v, i) => { saida += converter(v) + partes[i + 1]; });
  return new HtmlSeguro(saida);
}

/* ---------- Componentes reutilizáveis ---------- */

export const selo = (texto, variante = '') =>
  html`<span class="selo${variante ? ' selo--' + variante : ''}">${texto}</span>`;

const ICONES = { sucesso: '✓', aviso: '!', erro: '✕' };
export const alerta = (tipo, titulo, texto) => html`
  <div class="alerta alerta--${tipo}" role="${tipo === 'erro' ? 'alert' : 'status'}">
    <span class="alerta__icone" aria-hidden="true">${ICONES[tipo]}</span>
    <p class="alerta__texto"><strong>${titulo}</strong> ${texto}</p>
  </div>`;

export const cartaoProjeto = (p) => html`
  <li>
    <article class="cartao">
      <img class="cartao__imagem" src="../imagens/${p.imagem}.webp" alt="${p.alt}" width="640" height="400" loading="lazy">
      <div class="cartao__corpo">
        <h3 class="cartao__titulo">${p.titulo}</h3>
        <ul class="cartao__meta">
          <li>${p.vagasAbertas ? selo('Vagas abertas', 'destaque') : selo('Lista de espera', 'erro')}</li>
          <li>${selo(p.publico)}</li>
        </ul>
        <p>${p.resumo}</p>
        <a class="botao botao--secundario cartao__acao" href="#/projetos/${p.id}">
          Saiba mais<span class="visualmente-oculto"> sobre ${p.titulo}</span>
        </a>
      </div>
    </article>
  </li>`;

/**
 * Campo de formulário padronizado: rótulo, dica, controle e mensagem de erro
 * sempre com os mesmos ids, para o aria-describedby funcionar em todos.
 */
export function campo({ id, rotulo, tipo = 'text', atributos = '', dica = '', obrigatorio = true }) {
  const descr = [`${id}-erro`, dica ? `${id}-dica` : ''].filter(Boolean).join(' ');
  return html`
    <div class="campo" data-campo="${id}">
      <label class="campo__rotulo" for="${id}">${rotulo}${obrigatorio ? html` <span class="campo__obrigatorio" aria-hidden="true">*</span>` : ''}</label>
      ${dica ? html`<span class="campo__dica" id="${id}-dica">${dica}</span>` : ''}
      ${new HtmlSeguro(`<input class="campo__controle" id="${id}" name="${id}" type="${tipo}" ${atributos}${obrigatorio ? ' aria-required="true"' : ''} aria-describedby="${descr}">`)}
      <span class="campo__erro" id="${id}-erro" aria-live="polite"></span>
    </div>`;
}

/** Converte o resultado em nós reais do DOM (usado pelo roteador). */
export function renderizar(alvo, conteudo) {
  alvo.innerHTML = String(conteudo);
}
