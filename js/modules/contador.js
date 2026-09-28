/** contador.js - mantém o selo "Meus cadastros" do menu sincronizado com o localStorage. */
import { listarCadastros } from './storage.js';

export function atualizarContador() {
  const selo = document.querySelector('[data-contador-cadastros]');
  if (!selo) return;
  const total = listarCadastros().length;
  selo.querySelector('[data-contador-numero]').textContent = total;
  selo.querySelector('[data-contador-texto]').textContent = total === 1 ? ' cadastro salvo' : ' cadastros salvos';
  selo.hidden = total === 0;
}
