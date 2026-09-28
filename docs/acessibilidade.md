# Relatório de acessibilidade (WCAG 2.1 nível AA)

## Como foi auditado

| Verificação | Ferramenta | Resultado |
|---|---|---|
| Regras automáticas WCAG 2.0/2.1 A e AA + boas práticas | axe-core 4.x, em todas as 7 rotas, a 360px e 1280px | 0 violações |
| HTML e CSS válidos | Nu Html Checker (W3C), inclusive no DOM gerado pelo JS | 0 erros |
| Navegação só por teclado | Roteiro manual automatizado com Playwright (Tab, Enter, Esc) | 1 falha encontrada e corrigida |
| Reflow a 320px (1.4.10) | Largura de rolagem = largura da tela em todas as rotas | OK |
| Espaçamento de texto (1.4.12) | CSS de teste com line-height 1.5, letter-spacing .12em | Sem corte nem rolagem horizontal |
| Contraste (1.4.3 e 1.4.11) | Cálculo da razão de luminância de cada par de cores, nos 3 temas, conferido com o axe-core | Texto 4,5:1 ou mais; componentes 3:1 ou mais |
| Temas escuro e alto contraste (v1.1.0) | axe-core com o tema escolhido e com `prefers-color-scheme: dark` e `prefers-contrast: more` emulados no Playwright | 0 violações |

## Problemas encontrados e corrigidos

1. **Submenu com estado incoerente (4.1.2 Nome, função, valor).** No desktop, o submenu de "Projetos sociais" abria com `:focus-within` quando o foco chegava ao link, mas o botão continuava com `aria-expanded="false"`: o leitor de tela anunciava "recolhido" com o painel aberto.
   Correção: o painel passou a abrir só com o botão (padrão *disclosure* do WAI-ARIA) ou com o mouse, e fecha quando o foco sai do item (`focusout`).
2. **Aviso de projeto acadêmico fora de landmark (boa prática "region").** O axe apontou o aviso fora de qualquer região.
   Correção: o aviso virou um `<aside aria-label="Aviso sobre este site">`.

## Recursos de acessibilidade do projeto

- Link "Pular para o conteúdo"; landmarks `header`, `nav`, `main`, `aside` e `footer`.
- Um `h1` por tela; o foco vai para ele a cada troca de rota da SPA, e o `document.title` é atualizado.
- Foco visível com anel duplo (amarelo e escuro) em todos os elementos interativos.
- Alvos de toque de 44px ou mais.
- Formulário: `label` em todos os campos; erro com texto, ícone e borda (não depende só da cor); `aria-invalid`, `aria-describedby`, `aria-live`; resumo de erros com links.
- Modal com `<dialog>` nativo (prende o foco, fecha com Esc e devolve o foco).
- Toast com `role="status"`; filtros com `aria-pressed`; menu com `aria-expanded` e `aria-controls`.
- `prefers-reduced-motion` desativa as animações.
- Texto em `rem`: respeita o tamanho de fonte escolhido no sistema.

## Temas de cor (v1.1.0)

- **Como funciona:** os componentes usam só tokens semânticos (`--cor-texto`, `--cor-superficie`, `--cor-link`...). `css/temas.css` troca os valores desses tokens; nenhum componente foi reescrito para cada tema.
- **Automático:** sem escolha salva, valem as preferências do sistema: `prefers-color-scheme: dark` ativa o escuro e `prefers-contrast: more` ativa o alto contraste.
- **Manual:** o seletor "Tema de cores" no rodapé grava `data-tema` no `<html>` e no localStorage. Um script de uma linha no `<head>` reaplica o tema antes da primeira pintura, para a tela não "piscar" clara.
- **Alto contraste:** fundo preto, texto branco, links e botões amarelos, foco ciano, bordas brancas de 2px nos blocos e links com sublinhado mais grosso; nada depende de sombra.
- **Cores forçadas do Windows:** em `forced-colors: active` o navegador impõe as cores do sistema; o CSS só garante bordas, foco (`Highlight`) e o filtro ativo visíveis.
- **Logo:** tem texto escuro, então nos temas escuros ganha uma placa clara atrás.

| Par (texto / fundo) | Claro | Escuro | Alto contraste |
|---|---|---|---|
| Texto principal / fundo | `#1f2933` / `#ffffff` **14,8:1** | `#e6ebf0` / `#121820` **14,9:1** | `#ffffff` / `#000000` **21,0:1** |
| Texto secundário / fundo | `#52606d` / `#ffffff` **6,5:1** | `#aab6c2` / `#121820` **8,6:1** | `#ffffff` / `#000000` **21,0:1** |
| Link / fundo | `#0b5394` / `#ffffff` **7,8:1** | `#8cc4ff` / `#121820` **9,7:1** | `#ffff00` / `#000000` **19,6:1** |
| Texto do botão / botão | `#ffffff` / `#0b5394` **7,8:1** | `#0b1a2a` / `#8cc4ff` **9,6:1** | `#000000` / `#ffff00` **19,6:1** |
| Mensagem de erro / campo | `#b3261e` / `#ffffff` **6,5:1** | `#ff8a80` / `#1b232d` **6,9:1** | `#ff9e9e` / `#000000` **10,6:1** |
| Borda do campo / campo (3:1) | `#7b8794` / `#ffffff` **3,7:1** | `#8593a1` / `#1b232d` **5,0:1** | `#ffffff` / `#000000` **21,0:1** |
| Rodapé: texto / fundo | `#ffffff` / `#1f2933` **14,8:1** | `#e6ebf0` / `#0b1016` **15,9:1** | `#ffffff` / `#000000` **21,0:1** |

## Limitações conhecidas

- Os testes com leitores de tela reais (NVDA, TalkBack) ainda precisam ser feitos por uma pessoa.
- O submenu ainda não navega pelas setas do teclado (usa Tab, que também atende ao critério 2.1.1).
