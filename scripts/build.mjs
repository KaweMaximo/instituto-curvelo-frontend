/**
 * build.mjs - gera a versão de produção em dist/
 *  - JS: junta os módulos de js/ em um único arquivo minificado (esbuild)
 *  - CSS: junta os 5 arquivos e minifica
 *  - HTML: troca as 5 folhas + módulos por 1 CSS e 1 JS, ajusta caminhos e remove espaços
 *  - Copia imagens usadas (SVG/WebP) e a biblioteca Day.js
 * Uso: npm run build
 */
import { build } from 'esbuild';
import { readFile, writeFile, rm, mkdir, cp, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function tamanho(dir) {
  let total = 0;
  for (const nome of await readdir(dir, { recursive: true })) {
    const s = await stat(join(dir, nome));
    if (s.isFile()) total += s.size;
  }
  return total;
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// 1) JavaScript
await build({
  entryPoints: ['js/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020'],
  sourcemap: true,
  outfile: `${DIST}/js/main.min.js`,
  // No código-fonte a página fica em html/, então as imagens são "../imagens/".
  // Em produção o index.html fica na raiz de dist/.
  plugins: [{
    name: 'caminho-imagens',
    setup(b) {
      b.onLoad({ filter: /\.js$/ }, async (args) => ({
        contents: (await readFile(args.path, 'utf8')).replaceAll('../imagens/', 'imagens/'),
        loader: 'js'
      }));
    }
  }]
});

// 2) CSS
await build({
  entryPoints: ['css/estilos.css'],
  bundle: true,
  minify: true,
  outfile: `${DIST}/css/estilos.min.css`
});

// 3) HTML
let html = await readFile('html/index.html', 'utf8');
html = html
  .replace(/\s*<link rel="stylesheet" href="\.\.\/css\/[^"]+">/g, '')
  .replace(/\s*<!--[\s\S]*?-->/g, '')
  .replace(/<script type="module" src="\.\.\/js\/main\.js"><\/script>/,
    '<link rel="stylesheet" href="css/estilos.min.css">\n<script type="module" src="js/main.min.js"></script>')
  .replaceAll('../imagens/', 'imagens/')
  .replace(/\n\s+/g, '\n');
await writeFile(`${DIST}/index.html`, html);

// 4) Arquivos estáticos
await mkdir(`${DIST}/imagens`, { recursive: true });
for (const nome of await readdir('imagens')) {
  if (/\.(svg|webp)$/.test(nome) && !['mentoria.svg', 'oficina-tecnologia.svg', 'turma-oficina.svg'].includes(nome)) {
    await cp(`imagens/${nome}`, `${DIST}/imagens/${nome}`);
  }
}
await cp('js/vendor', `${DIST}/vendor`, { recursive: true });

// 5) Relatório
// Só o código do projeto: o Day.js (js/vendor) já vem minificado e é copiado sem mudança,
// então fica fora da comparação dos dois lados.
const antes = (await tamanho('css')) + (await tamanho('js')) - (await tamanho('js/vendor')) + (await tamanho('html'));
const depois = (await tamanho(`${DIST}/css`)) + (await tamanho(`${DIST}/js`)) - (await stat(`${DIST}/js/main.min.js.map`)).size
  + (await stat(`${DIST}/index.html`)).size;
const reducao = Math.round((1 - depois / antes) * 100);
console.log(`HTML+CSS+JS: ${(antes / 1024).toFixed(1)} KB -> ${(depois / 1024).toFixed(1)} KB (-${reducao}%, sem o source map)`);
console.log(`dist/ completo: ${((await tamanho(DIST)) / 1024).toFixed(1)} KB`);
