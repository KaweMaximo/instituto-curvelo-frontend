/**
 * formulario.js - controla o cadastro: validação com feedback, máscaras,
 * rascunho automático no localStorage e envio com confirmação.
 */
import { REGRAS } from './validacao.js';
import { aplicarMascaras } from './mascaras.js';
import { ler, salvar, remover, CHAVES, adicionarCadastro } from './storage.js';
import { confirmar, mostrarToast } from './ui.js';
import { html, alerta, renderizar } from './templates.js';

const CAMPOS_RASCUNHO = ['tipo_apoio', 'nome', 'nascimento', 'email', 'telefone', 'cep', 'cidade', 'estado'];
// O CPF não entra no rascunho de propósito: dado sensível não fica salvo antes do envio (LGPD).

/* ---------- Feedback visual de um campo ---------- */
function marcarCampo(form, nome, mensagem) {
  const bloco = form.querySelector(`[data-campo="${nome}"]`);
  const controle = form.elements[nome];
  if (!bloco || !controle) return;
  const erro = bloco.querySelector('.campo__erro');
  bloco.classList.toggle('campo--invalido', Boolean(mensagem));
  bloco.classList.toggle('campo--valido', !mensagem);
  if (erro) erro.textContent = mensagem;
  // RadioNodeList (grupo de rádios) não tem setAttribute; marca o primeiro
  const alvo = controle instanceof RadioNodeList ? controle[0] : controle;
  alvo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

function validarCampo(form, nome) {
  const controle = form.elements[nome];
  let mensagem = '';
  if (nome === 'tipo_apoio') mensagem = controle.value ? '' : 'Escolha como você quer ajudar.';
  else if (nome === 'lgpd') mensagem = controle.checked ? '' : 'É preciso aceitar a política de privacidade.';
  else if (REGRAS[nome]) mensagem = REGRAS[nome](controle.value);
  marcarCampo(form, nome, mensagem);
  return mensagem;
}

/* ---------- Rascunho automático ---------- */
function salvarRascunho(form) {
  const rascunho = {};
  CAMPOS_RASCUNHO.forEach((n) => { rascunho[n] = form.elements[n].value; });
  salvar(CHAVES.rascunho, rascunho);
}

function restaurarRascunho(form) {
  const rascunho = ler(CHAVES.rascunho);
  if (!rascunho) return false;
  CAMPOS_RASCUNHO.forEach((n) => { if (rascunho[n]) form.elements[n].value = rascunho[n]; });
  return true;
}

const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ---------- Resumo de erros (link para cada campo) ---------- */
function mostrarResumo(form, erros) {
  const caixa = form.querySelector('[data-resumo-erros]');
  if (!erros.length) { caixa.hidden = true; caixa.innerHTML = ''; return; }
  renderizar(caixa, html`
    ${alerta('erro', `Encontramos ${erros.length} ${erros.length === 1 ? 'problema' : 'problemas'}.`, 'Corrija os campos abaixo:')}
    <ul>${erros.map((e) => html`<li><a href="#${e.nome === 'tipo_apoio' ? 'apoio-voluntario' : e.nome}" data-foca="${e.nome}">${e.mensagem}</a></li>`)}</ul>`);
  caixa.hidden = false;
  caixa.focus();
}

/* ---------- Inicialização (chamada pela view de cadastro) ---------- */
export function iniciarFormulario(form, { aoEnviar } = {}) {
  aplicarMascaras(form);
  if (restaurarRascunho(form)) {
    mostrarToast('Recuperamos o que você já tinha preenchido.');
  }

  const salvarDepois = debounce(() => salvarRascunho(form), 300);
  const tocados = new Set();

  // Valida ao sair do campo; depois do primeiro erro, revalida a cada digitação
  form.addEventListener('focusout', (e) => {
    const nome = e.target.name;
    if (!nome || nome === 'site') return;
    tocados.add(nome);
    validarCampo(form, nome);
  });
  form.addEventListener('input', (e) => {
    salvarDepois();
    if (tocados.has(e.target.name)) validarCampo(form, e.target.name);
  });
  form.addEventListener('change', (e) => {
    salvarDepois();
    if (e.target.type === 'radio' || e.target.type === 'checkbox' || e.target.tagName === 'SELECT') {
      tocados.add(e.target.name);
      validarCampo(form, e.target.name);
    }
  });

  // Links do resumo de erros levam o foco ao campo (sem mexer no hash da SPA)
  form.addEventListener('click', (e) => {
    const link = e.target.closest('[data-foca]');
    if (!link) return;
    e.preventDefault();
    const c = form.elements[link.dataset.foca];
    (c instanceof RadioNodeList ? c[0] : c).focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomes = ['tipo_apoio', ...Object.keys(REGRAS), 'lgpd'];
    const erros = nomes
      .map((nome) => ({ nome, mensagem: validarCampo(form, nome) }))
      .filter((r) => r.mensagem);
    mostrarResumo(form, erros);
    if (erros.length) return;

    // Anti-spam sem CAPTCHA: robôs preenchem o campo invisível
    if (form.elements.site.value) { form.reset(); return; }

    const ok = await confirmar({
      titulo: 'Confirmar cadastro?',
      texto: 'Vamos usar seus dados apenas para entrar em contato sobre voluntariado e doações.',
      rotuloConfirmar: 'Confirmar envio',
      rotuloCancelar: 'Revisar dados'
    });
    if (!ok) return;

    const d = Object.fromEntries(new FormData(form));
    const salvo = adicionarCadastro({
      tipo: d.tipo_apoio,
      nome: d.nome.trim().replace(/\s+/g, ' '),
      email: d.email.trim(),
      telefone: d.telefone,
      cidade: d.cidade.trim(),
      estado: d.estado,
      cpfFinal: d.cpf.slice(-6) // guarda só o final, mascarado na exibição
    });
    if (!salvo) {
      mostrarResumo(form, []);
      mostrarToast('Não foi possível salvar neste aparelho. Tente novamente.');
      return;
    }
    remover(CHAVES.rascunho);
    form.reset();
    mostrarToast('Cadastro enviado! Nossa equipe entrará em contato em até 7 dias.');
    if (aoEnviar) aoEnviar(salvo);
  });
}
