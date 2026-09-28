# Relatório de acessibilidade (WCAG 2.1 nível AA)

## Como foi auditado

| Verificação | Ferramenta | Resultado |
|---|---|---|
| Regras automáticas WCAG 2.0/2.1 A e AA + boas práticas | axe-core 4.x, em todas as 7 rotas, a 360px e 1280px | 0 violações |
| HTML e CSS válidos | Nu Html Checker (W3C), inclusive no DOM gerado pelo JS | 0 erros |
| Navegação só por teclado | Roteiro manual automatizado com Playwright (Tab, Enter, Esc) | 1 falha encontrada e corrigida |
| Reflow a 320px (1.4.10) | Largura de rolagem = largura da tela em todas as rotas | OK |
| Espaçamento de texto (1.4.12) | CSS de teste com line-height 1.5, letter-spacing .12em | Sem corte nem rolagem horizontal |
| Contraste (1.4.3 e 1.4.11) | Cálculo da razão de luminância de cada par de cores | Texto 4,5:1 ou mais; componentes 3:1 ou mais |

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

## Limitações conhecidas

- Os testes com leitores de tela reais (NVDA, TalkBack) ainda precisam ser feitos por uma pessoa.
- O submenu ainda não navega pelas setas do teclado (usa Tab, que também atende ao critério 2.1.1).
