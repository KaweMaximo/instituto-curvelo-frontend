/**
 * mascaras.js - formata CPF, celular e CEP enquanto a pessoa digita.
 * Funções puras (texto entra, texto sai) para facilitar os testes.
 */
import { soDigitos } from './validacao.js';

export const MASCARAS = {
  cpf: (v) => soDigitos(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2'),
  telefone: (v) => {
    const d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return d.replace(/(\d{1,2})/, '($1');
    if (d.length <= 6) return d.replace(/(\d{2})(\d+)/, '($1) $2');
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },
  cep: (v) => soDigitos(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
};

/** Liga as máscaras aos campos existentes dentro de "raiz" (delegação de evento). */
export function aplicarMascaras(raiz) {
  raiz.addEventListener('input', (e) => {
    const mascara = MASCARAS[e.target.name];
    if (mascara) e.target.value = mascara(e.target.value);
  });
}
