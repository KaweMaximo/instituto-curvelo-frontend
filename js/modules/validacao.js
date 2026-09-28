/**
 * validacao.js - regras de consistência dos dados do cadastro.
 * Complementa (não substitui) a validação nativa do HTML5: o pattern confere
 * o FORMATO, e estas funções conferem se o dado FAZ SENTIDO
 * (dígitos verificadores do CPF, idade mínima, DDD existente...).
 * Cada regra devolve '' quando está tudo certo ou a mensagem de erro.
 */

export const soDigitos = (v) => String(v).replace(/\D/g, '');

export function validarCPF(valor) {
  const cpf = soDigitos(valor);
  if (cpf.length !== 11) return 'Digite os 11 números do CPF.';
  if (/^(\d)\1{10}$/.test(cpf)) return 'CPF inválido: todos os números são iguais.';
  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = calcularDigito(cpf.slice(0, 9));
  const d2 = calcularDigito(cpf.slice(0, 10));
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]) ? '' : 'CPF inválido: confira os números digitados.';
}

export function validarNome(valor) {
  const nome = valor.trim().replace(/\s+/g, ' ');
  if (nome.length < 3) return 'Informe seu nome completo.';
  if (!nome.includes(' ')) return 'Informe nome e sobrenome.';
  if (/\d/.test(nome)) return 'O nome não pode ter números.';
  return '';
}

export function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim()) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.';
}

export function validarTelefone(valor) {
  const tel = soDigitos(valor);
  if (tel.length < 10 || tel.length > 11) return 'Digite o DDD e o número, por exemplo (11) 91234-5678.';
  if (Number(tel.slice(0, 2)) < 11) return 'DDD inválido.';
  if (tel.length === 11 && tel[2] !== '9') return 'Celular com 11 dígitos deve começar com 9 depois do DDD.';
  return '';
}

export function validarCEP(valor) {
  return soDigitos(valor).length === 8 ? '' : 'Digite os 8 números do CEP.';
}

export function validarNascimento(valor, hoje = new Date()) {
  if (!valor) return 'Informe sua data de nascimento.';
  const nasc = new Date(valor + 'T00:00:00');
  if (Number.isNaN(nasc.getTime()) || nasc > hoje) return 'Data de nascimento inválida.';
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate());
  if (aindaNaoFezAniversario) idade--;
  if (idade < 16) return 'É preciso ter 16 anos ou mais para se cadastrar.';
  if (idade > 120) return 'Data de nascimento inválida.';
  return '';
}

export const obrigatorio = (msg) => (valor) => (String(valor).trim() ? '' : msg);

/** Mapa campo -> regra, usado pelo módulo do formulário. */
export const REGRAS = {
  nome: validarNome,
  cpf: validarCPF,
  nascimento: (v) => validarNascimento(v),
  email: validarEmail,
  telefone: validarTelefone,
  cep: validarCEP,
  cidade: obrigatorio('Informe sua cidade.'),
  estado: obrigatorio('Selecione seu estado.')
};
