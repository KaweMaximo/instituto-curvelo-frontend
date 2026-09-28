/**
 * storage.js - camada única de acesso ao localStorage.
 * Tudo passa por aqui: prefixo de chave, JSON e tratamento de erro
 * (modo anônimo, cota cheia ou armazenamento bloqueado não quebram a página).
 */
const PREFIXO = 'curvelo:v1:';

export const CHAVES = {
  cadastros: 'cadastros',       // lista de cadastros enviados
  rascunho: 'rascunho-cadastro' // formulário em andamento (salvo a cada digitação)
};

export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch (erro) {
    console.warn('[storage] leitura falhou:', chave, erro);
    return padrao;
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn('[storage] gravação falhou:', chave, erro);
    return false;
  }
}

export function remover(chave) {
  try { localStorage.removeItem(PREFIXO + chave); } catch (erro) { /* ignora */ }
}

/* ---------- Operações de domínio: cadastros ---------- */
export function listarCadastros() {
  return ler(CHAVES.cadastros, []);
}

export function adicionarCadastro(dados) {
  const lista = listarCadastros();
  const novo = { ...dados, id: Date.now().toString(36), criadoEm: new Date().toISOString() };
  lista.push(novo);
  return salvar(CHAVES.cadastros, lista) ? novo : null;
}

export function excluirCadastro(id) {
  salvar(CHAVES.cadastros, listarCadastros().filter((c) => c.id !== id));
}
