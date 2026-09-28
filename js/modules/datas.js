/**
 * datas.js - integração com a biblioteca Day.js (MIT, ~7 KB).
 *
 * Por que uma biblioteca: exibir "enviado há 3 minutos" / "há 2 dias" em
 * português, com arredondamentos e pluralização corretos, é trabalhoso e
 * fácil de errar. O Day.js resolve isso com o plugin relativeTime e o locale pt-br.
 *
 * Decisões de integração:
 * - Os arquivos ficam em js/vendor/dayjs (cópia local): não dependemos de CDN,
 *   o que é melhor para conexões instáveis e evita pedidos a terceiros (LGPD).
 * - Carregamento sob demanda (lazy): só baixamos a biblioteca na tela que usa.
 * - Adaptador: o resto do app chama apenas formatarRelativo(). Se a biblioteca
 *   falhar ao carregar, há um fallback com Intl nativo, e nada quebra.
 * - Escopo: o build UMD cria só window.dayjs e os globais do plugin; nenhum
 *   outro módulo acessa esses globais diretamente.
 */
const BASE = new URL('../vendor/dayjs/', import.meta.url);
let carregamento = null;

function carregarScript(arquivo) {
  return new Promise((resolver, rejeitar) => {
    const s = document.createElement('script');
    s.src = new URL(arquivo, BASE).href;
    s.onload = resolver;
    s.onerror = () => rejeitar(new Error(`Falha ao carregar ${arquivo}`));
    document.head.append(s);
  });
}

/** Carrega e configura o Day.js uma única vez (a Promise fica em cache). */
export function carregarDayjs() {
  if (!carregamento) {
    carregamento = carregarScript('dayjs.min.js')
      .then(() => Promise.all([carregarScript('relativeTime.js'), carregarScript('pt-br.js')]))
      .then(() => {
        const dayjs = window.dayjs;
        dayjs.extend(window.dayjs_plugin_relativeTime); // habilita .fromNow()
        dayjs.locale('pt-br');                           // textos em português
        return dayjs;
      })
      .catch((erro) => { console.warn('[datas] usando fallback:', erro); return null; });
  }
  return carregamento;
}

/** "há 5 minutos". Sem a biblioteca, cai para a data curta (28/09/2026). */
export async function formatarRelativo(iso) {
  const dayjs = await carregarDayjs();
  return dayjs ? dayjs(iso).fromNow() : new Date(iso).toLocaleDateString('pt-BR');
}

/** Data completa para o atributo datetime/title: "28 de setembro de 2026, 14:32". */
export function formatarCompleto(iso) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso));
}
