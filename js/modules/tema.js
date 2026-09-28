/**
 * tema.js - seletor de tema de cores (automático, claro, escuro, alto contraste).
 *
 * O tema é só um atributo data-tema no <html>; as cores vêm de css/temas.css.
 * - "Automático" remove o atributo: valem as preferências do sistema
 *   (prefers-color-scheme e prefers-contrast).
 * - A escolha fica no localStorage. Um script curto no <head> reaplica o tema
 *   antes da primeira pintura, para a página não abrir clara e depois escurecer.
 */
import { ler, salvar, remover, CHAVES } from './storage.js';

const TEMAS = ['claro', 'escuro', 'alto-contraste'];

export function aplicarTema(tema) {
  const raiz = document.documentElement;
  if (TEMAS.includes(tema)) {
    raiz.setAttribute('data-tema', tema);
    salvar(CHAVES.tema, tema);
  } else {
    raiz.removeAttribute('data-tema');
    remover(CHAVES.tema);
  }
}

export function iniciarTema() {
  const seletor = document.getElementById('tema');
  if (!seletor) return;
  const salvo = ler(CHAVES.tema, '');
  seletor.value = TEMAS.includes(salvo) ? salvo : '';
  seletor.addEventListener('change', () => aplicarTema(seletor.value));
}
