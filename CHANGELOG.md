# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-09-28

### Adicionado
- Estrutura semântica em HTML5 e pastas separadas (html, css, imagens, js).
- Design system em variáveis CSS, grade de 12 colunas e 5 breakpoints.
- SPA com roteamento por hash, templates com escape automático e views.
- Cadastro com validação de consistência (CPF, idade, DDD), máscaras e rascunho no localStorage.
- "Meus cadastros" com exclusão e datas relativas (Day.js).
- Build de produção com esbuild e deploy automático no GitHub Pages.

### Corrigido
- Submenu abria por foco sem atualizar `aria-expanded` (WCAG 4.1.2).
- Selo do contador visível com zero cadastros (`[hidden]` vencido por `display`).
- Borda de erro sobrescrita por `:user-valid` após o envio.
