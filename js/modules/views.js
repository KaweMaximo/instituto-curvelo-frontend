/**
 * views.js - cada tela da SPA é uma função que devolve:
 *   { titulo, conteudo, montar(raiz) }
 * "conteudo" é o HTML gerado por templates; "montar" liga os eventos
 * depois que o HTML entra na página.
 */
import { html, alerta, cartaoProjeto, campo, selo, renderizar } from './templates.js';
import { PROJETOS, CATEGORIAS, buscarProjeto } from './dados.js';
import { listarCadastros, excluirCadastro } from './storage.js';
import { iniciarFormulario } from './formulario.js';
import { confirmar, mostrarToast } from './ui.js';
import { formatarRelativo, formatarCompleto } from './datas.js';
import { atualizarContador } from './contador.js';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

/* ---------- Início ---------- */
export function inicio() {
  return {
    titulo: 'Início',
    conteudo: html`
      <section class="hero" aria-labelledby="titulo-view">
        <div class="container grade">
          <div class="lg-metade">
            <h1 id="titulo-view" data-titulo-view tabindex="-1">Instituto Curvelo</h1>
            <p>Organização do terceiro setor dedicada à educação e à formação em ciência e tecnologia.</p>
            <div class="linha">
              <a class="botao" href="#/cadastro">Quero ajudar</a>
              <a class="botao botao--secundario" href="#/projetos">Conhecer os projetos</a>
            </div>
          </div>
          <figure class="lg-metade">
            <img src="../imagens/turma-oficina.webp" alt="Estudantes em uma bancada montando um circuito eletrônico com a orientação de uma educadora" width="640" height="400">
            <figcaption><small>Oficina de eletrônica para estudantes da rede pública.</small></figcaption>
          </figure>
        </div>
      </section>
      <section class="secao" aria-labelledby="destaques">
        <div class="container">
          <h2 id="destaques">Projetos com vagas abertas</h2>
          <ul class="grade-cartoes">${PROJETOS.filter((p) => p.vagasAbertas).map(cartaoProjeto)}</ul>
        </div>
      </section>`
  };
}

/* ---------- Lista de projetos com filtro ---------- */
export function projetos() {
  const botoesFiltro = [['todos', 'Todos'], ...Object.entries(CATEGORIAS)];
  return {
    titulo: 'Projetos sociais',
    conteudo: html`
      <section class="secao" aria-labelledby="titulo-view">
        <div class="container">
          <h1 id="titulo-view" data-titulo-view tabindex="-1">Projetos sociais</h1>
          <p class="leitura">Conheça nossas frentes de atuação e escolha como participar.</p>
          <ul class="filtros" aria-label="Filtrar projetos por categoria">
            ${botoesFiltro.map(([valor, rotulo]) => html`
              <li><button class="filtro" type="button" data-filtro="${valor}" aria-pressed="${valor === 'todos'}">${rotulo}</button></li>`)}
          </ul>
          <h2 class="visualmente-oculto" id="resultado-filtro">Lista de projetos</h2>
          <p class="visualmente-oculto" aria-live="polite" data-status-filtro></p>
          <ul class="grade-cartoes" data-lista-projetos aria-labelledby="resultado-filtro">${PROJETOS.map(cartaoProjeto)}</ul>
        </div>
      </section>`,
    montar(raiz) {
      const lista = raiz.querySelector('[data-lista-projetos]');
      const status = raiz.querySelector('[data-status-filtro]');
      raiz.querySelector('.filtros').addEventListener('click', (e) => {
        const botao = e.target.closest('[data-filtro]');
        if (!botao) return;
        const filtro = botao.dataset.filtro;
        raiz.querySelectorAll('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
        const visiveis = PROJETOS.filter((p) => filtro === 'todos' || p.categoria === filtro);
        renderizar(lista, html`${visiveis.map(cartaoProjeto)}`);
        status.textContent = `${visiveis.length} ${visiveis.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}.`;
      });
    }
  };
}

/* ---------- Detalhe de um projeto (rota com parâmetro) ---------- */
export function projeto(id) {
  const p = buscarProjeto(id);
  if (!p) return naoEncontrada();
  return {
    titulo: p.titulo,
    conteudo: html`
      <article class="secao" aria-labelledby="titulo-view">
        <div class="container grade">
          <div class="lg-metade">
            <p><a href="#/projetos">← Voltar para projetos</a></p>
            <h1 id="titulo-view" data-titulo-view tabindex="-1">${p.titulo}</h1>
            <ul class="cartao__meta">
              <li>${p.vagasAbertas ? selo('Vagas abertas', 'destaque') : selo('Lista de espera', 'erro')}</li>
              <li>${selo(p.publico)}</li><li>${selo(p.quando)}</li>
            </ul>
            <p>${p.descricao}</p>
            ${p.vagasAbertas ? '' : alerta('aviso', 'Turma completa.', 'Cadastre-se para entrar na lista de espera.')}
            <a class="botao" href="#/cadastro">${p.vagasAbertas ? 'Quero participar' : 'Entrar na lista de espera'}</a>
          </div>
          <img class="lg-metade" src="../imagens/${p.imagem}.webp" alt="${p.alt}" width="640" height="400">
        </div>
      </article>`
  };
}

/* ---------- Cadastro ---------- */
export function cadastro() {
  return {
    titulo: 'Cadastro',
    conteudo: html`
      <section class="secao" aria-labelledby="titulo-view">
        <div class="container">
          <h1 id="titulo-view" data-titulo-view tabindex="-1">Cadastro de voluntários e doadores</h1>
          <p class="leitura">Campos com <span class="campo__obrigatorio" aria-hidden="true">*</span> são obrigatórios. O que você digitar fica salvo neste aparelho até o envio, exceto o CPF.</p>
          <form class="formulario" novalidate>
            <div class="resumo-erros" data-resumo-erros tabindex="-1" hidden></div>

            <fieldset class="grupo" data-campo="tipo_apoio" role="radiogroup" aria-required="true">
              <legend class="grupo__legenda">Como você quer ajudar? <span class="campo__obrigatorio" aria-hidden="true">*</span></legend>
              <div class="opcao"><input type="radio" id="apoio-voluntario" name="tipo_apoio" value="voluntario" aria-describedby="tipo_apoio-erro"><label for="apoio-voluntario">Quero ser voluntário</label></div>
              <div class="opcao"><input type="radio" id="apoio-doador" name="tipo_apoio" value="doador" aria-describedby="tipo_apoio-erro"><label for="apoio-doador">Quero ser doador</label></div>
              <div class="opcao"><input type="radio" id="apoio-ambos" name="tipo_apoio" value="ambos" aria-describedby="tipo_apoio-erro"><label for="apoio-ambos">Os dois</label></div>
              <span class="campo__erro" id="tipo_apoio-erro" aria-live="polite"></span>
            </fieldset>

            <fieldset class="grupo">
              <legend class="grupo__legenda">Dados pessoais</legend>
              ${campo({ id: 'nome', rotulo: 'Nome completo', atributos: 'autocomplete="name" maxlength="120"' })}
              ${campo({ id: 'cpf', rotulo: 'CPF', atributos: 'inputmode="numeric" maxlength="14" placeholder="000.000.000-00"', dica: 'Só números; os pontos e o traço entram sozinhos.' })}
              ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', atributos: 'autocomplete="bday"', dica: 'É preciso ter 16 anos ou mais.' })}
            </fieldset>

            <fieldset class="grupo">
              <legend class="grupo__legenda">Contato</legend>
              <div class="grade">
                <div class="sm-metade">${campo({ id: 'email', rotulo: 'E-mail', tipo: 'email', atributos: 'autocomplete="email" maxlength="120" placeholder="nome@exemplo.com"' })}</div>
                <div class="sm-metade">${campo({ id: 'telefone', rotulo: 'Celular com DDD', tipo: 'tel', atributos: 'autocomplete="tel" maxlength="15" placeholder="(11) 90000-0000"' })}</div>
              </div>
            </fieldset>

            <fieldset class="grupo">
              <legend class="grupo__legenda">Endereço</legend>
              ${campo({ id: 'cep', rotulo: 'CEP', atributos: 'inputmode="numeric" autocomplete="postal-code" maxlength="9" placeholder="00000-000"' })}
              ${campo({ id: 'cidade', rotulo: 'Cidade', atributos: 'autocomplete="address-level2" maxlength="80"' })}
              <div class="campo" data-campo="estado">
                <label class="campo__rotulo" for="estado">Estado <span class="campo__obrigatorio" aria-hidden="true">*</span></label>
                <select class="campo__controle" id="estado" name="estado" autocomplete="address-level1" aria-required="true" aria-describedby="estado-erro">
                  <option value="">Selecione</option>
                  ${UFS.map((uf) => html`<option value="${uf}">${uf}</option>`)}
                </select>
                <span class="campo__erro" id="estado-erro" aria-live="polite"></span>
              </div>
            </fieldset>

            <div class="campo" data-campo="lgpd">
              <div class="opcao">
                <input type="checkbox" id="lgpd" name="lgpd" value="aceito" aria-describedby="lgpd-erro">
                <label for="lgpd">Li e aceito a <a href="#/privacidade">política de privacidade</a>. <span class="campo__obrigatorio" aria-hidden="true">*</span></label>
              </div>
              <span class="campo__erro" id="lgpd-erro" aria-live="polite"></span>
            </div>

            <div class="armadilha" aria-hidden="true">
              <label for="site">Não preencha este campo</label>
              <input type="text" id="site" name="site" tabindex="-1" autocomplete="off">
            </div>

            <button class="botao" type="submit">Enviar cadastro</button>
          </form>
        </div>
      </section>`,
    montar(raiz) {
      iniciarFormulario(raiz.querySelector('form'), {
        aoEnviar: () => { atualizarContador(); location.hash = '#/meus-cadastros'; }
      });
    }
  };
}

/* ---------- Meus cadastros (dados lidos do localStorage) ---------- */
const TIPOS = { voluntario: 'Voluntário', doador: 'Doador', ambos: 'Voluntário e doador' };

/** Troca a data curta por "há 5 minutos" quando o Day.js termina de carregar. */
async function preencherDatasRelativas(raiz) {
  for (const el of raiz.querySelectorAll('time[data-relativo]')) {
    el.textContent = await formatarRelativo(el.getAttribute('datetime'));
  }
}

export function meusCadastros() {
  const lista = listarCadastros();
  return {
    titulo: 'Meus cadastros',
    conteudo: html`
      <section class="secao" aria-labelledby="titulo-view">
        <div class="container leitura">
          <h1 id="titulo-view" data-titulo-view tabindex="-1">Meus cadastros</h1>
          <p>Cadastros enviados a partir deste aparelho. Os dados ficam salvos no navegador (localStorage).</p>
          ${lista.length === 0
            ? alerta('aviso', 'Nenhum cadastro por aqui ainda.', html`<a href="#/cadastro">Fazer meu cadastro</a>`)
            : html`<ul class="lista-cadastros">${lista.map((c) => html`
              <li class="cadastro-item">
                <p class="cadastro-item__dados">
                  <strong>${c.nome}</strong> ${selo(TIPOS[c.tipo] || c.tipo)}<br>
                  <small>${c.email} · ${c.cidade}/${c.estado} · CPF ***.${c.cpfFinal} · enviado <time datetime="${c.criadoEm}" title="${formatarCompleto(c.criadoEm)}" data-relativo>${new Date(c.criadoEm).toLocaleDateString('pt-BR')}</time></small>
                </p>
                <button class="botao botao--perigo" type="button" data-excluir="${c.id}">Excluir<span class="visualmente-oculto"> cadastro de ${c.nome}</span></button>
              </li>`)}</ul>`}
        </div>
      </section>`,
    montar(raiz) {
      preencherDatasRelativas(raiz);
      raiz.addEventListener('click', async (e) => {
        const botao = e.target.closest('[data-excluir]');
        if (!botao) return;
        const ok = await confirmar({ titulo: 'Excluir cadastro?', texto: 'Esta ação não pode ser desfeita.', rotuloConfirmar: 'Excluir' });
        if (!ok) return;
        excluirCadastro(botao.dataset.excluir);
        atualizarContador();
        mostrarToast('Cadastro excluído.');
        const nova = meusCadastros();                // re-renderiza só esta view
        renderizar(raiz, nova.conteudo);
        preencherDatasRelativas(raiz);
        raiz.querySelector('[data-titulo-view]').focus();
      });
    }
  };
}

/* ---------- Páginas simples ---------- */
export const privacidade = () => ({
  titulo: 'Política de privacidade',
  conteudo: html`
    <section class="secao"><div class="container leitura">
      <h1 id="titulo-view" data-titulo-view tabindex="-1">Política de privacidade</h1>
      <p>Usamos seus dados apenas para contato sobre voluntariado e doações, conforme a LGPD. Nesta versão de demonstração, os cadastros ficam somente no seu navegador e podem ser excluídos em "Meus cadastros".</p>
    </div></section>`
});

export const naoEncontrada = () => ({
  titulo: 'Página não encontrada',
  conteudo: html`
    <section class="secao"><div class="container leitura">
      <h1 id="titulo-view" data-titulo-view tabindex="-1">Página não encontrada</h1>
      ${alerta('erro', 'Endereço inválido.', html`<a href="#/inicio">Voltar para o início</a>`)}
    </div></section>`
});
