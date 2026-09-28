# Instituto Curvelo · Plataforma web (projeto acadêmico)

Plataforma de página única (SPA) para divulgar projetos sociais e cadastrar voluntários e doadores, desenvolvida nas Experiências Práticas I a IV da disciplina **Desenvolvimento Front-end para Web** (Engenharia de Software, Cruzeiro do Sul Virtual, 2026/2).

> **Aviso:** projeto acadêmico com conteúdo ilustrativo. Não é o site oficial do Instituto Curvelo. Os cadastros ficam apenas no navegador de quem testa (localStorage); nenhum dado é enviado a servidores.

**Demonstração:** https://kawemaximo.github.io/instituto-curvelo-frontend/

## Funcionalidades

- Navegação SPA por hash (`#/inicio`, `#/projetos`, `#/projetos/:id`, `#/cadastro`, `#/meus-cadastros`), com página 404.
- Lista de projetos gerada por templates, com filtro por categoria.
- Cadastro com validação de consistência (dígitos verificadores do CPF, idade mínima, DDD, e-mail), máscaras e resumo de erros.
- Rascunho salvo automaticamente e lista "Meus cadastros" no localStorage.
- Menu responsivo (hambúrguer no celular, dropdown no desktop), modal de confirmação e toast.
- Conformidade com WCAG 2.1 AA; veja [docs/acessibilidade.md](docs/acessibilidade.md).

## Tecnologias

HTML5 semântico, CSS3 (variáveis, Grid, Flexbox), JavaScript ES Modules (sem framework), [Day.js](https://day.js.org/) para datas relativas e [esbuild](https://esbuild.github.io/) para o build de produção. Deploy com GitHub Actions no GitHub Pages.

## Como executar

Pré-requisitos: Node.js 20 ou superior (só para o build) e Python 3 (ou qualquer servidor estático).

```bash
git clone https://github.com/KaweMaximo/instituto-curvelo-frontend.git
cd instituto-curvelo-frontend
npm install

# Desenvolvimento: serve os arquivos-fonte
npm run dev            # abra http://localhost:8000/html/index.html

# Produção: gera dist/ e serve a versão otimizada
npm run build
npm run preview        # abra http://localhost:8080
```

Os módulos ES não funcionam abrindo o arquivo direto (`file://`); use sempre um servidor.

## Estrutura

```
├── html/index.html        casca da SPA (cabeçalho, main, rodapé, modal, toast)
├── css/                   tokens (design system), base, layout, components, spa
│   └── estilos.css        ponto de entrada do CSS para o build
├── imagens/               SVG e WebP (usados) + JPG/PNG de compatibilidade
├── js/
│   ├── main.js            ponto de entrada
│   ├── modules/           router, views, templates, formulario, validacao,
│   │                      mascaras, storage, datas, ui, contador, dados
│   └── vendor/dayjs/      Day.js (cópia local, licença MIT)
├── scripts/build.mjs      build de produção
├── docs/acessibilidade.md relatório de auditoria WCAG 2.1 AA
└── .github/workflows/deploy.yml
```

## Build de produção

`npm run build` gera `dist/` com:

- **JS:** 12 módulos juntados e minificados em `js/main.min.js` (com source map).
- **CSS:** 5 folhas unidas e minificadas em `css/estilos.min.css`.
- **HTML:** 1 CSS e 1 JS no lugar de 5 folhas e 12 módulos; comentários e espaços removidos.
- **Imagens:** apenas os formatos usados (SVG e WebP, de 3 a 4 KB cada).

Resultado: HTML + CSS + JS passam de cerca de 78 KB para 44 KB, e o número de arquivos baixados na abertura cai de 18 (1 HTML, 5 CSS e 12 JS) para 3.

## Fluxo de trabalho (GitFlow)

| Branch | Uso |
|---|---|
| `main` | versão publicada; cada merge dispara o deploy |
| `develop` | integração das funcionalidades |
| `feature/*` | uma branch por funcionalidade, sempre criada a partir de `develop` |
| `hotfix/*` | correção urgente criada a partir de `main` e mesclada em `main` e `develop` |

Toda mudança entra por pull request (`feature/*` → `develop` → `main`), usando o checklist de `.github/pull_request_template.md`.

### Commits semânticos ([Conventional Commits](https://www.conventionalcommits.org/pt-br/))

`feat:` funcionalidade · `fix:` correção · `docs:` documentação · `style:` CSS/visual · `refactor:` reorganização sem mudar comportamento · `chore:` configuração e build.

Exemplo: `feat(cadastro): valida dígitos verificadores do CPF`

## Manutenção

- **Novo projeto social:** acrescente um objeto em `js/modules/dados.js`. Cartão, filtro e página de detalhe são gerados automaticamente.
- **Cores, fontes e espaçamentos:** altere só `css/tokens.css`.
- **Nova rota:** crie a view em `views.js` e registre em `ROTAS` no `router.js`.
- **Integração com back-end:** substitua as funções de `storage.js`; o restante da aplicação não precisa mudar.
- Antes de abrir um PR, rode o axe-core e o validador W3C (veja `docs/acessibilidade.md`).

## Licença

Código sob licença [MIT](LICENSE). Day.js © iamkun, também sob licença MIT.
