// Run after npm ci in a checkout of the pinned upstream revision; see vendor README.
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const revision = '7c379edba7ffb89abcae01b0806f20ed43dbc627';
const source = path.resolve(process.argv[2] || '');
if (!process.argv[2] || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim() !== revision) {
  throw new Error(`Provide a Vitrine checkout at ${revision}.`);
}
const destination = fileURLToPath(new URL('../ropa/static/vendor/vitrine/', import.meta.url));
const { build } = await import(pathToFileURL(path.join(source, 'node_modules/esbuild/lib/main.js')));
await mkdir(destination, { recursive: true });
await build({
  stdin: {
    contents: `export { VtJson } from './src/components/json/vt-json.js';
export { VtMarkdown } from './src/components/markdown/vt-markdown.js';`,
    resolveDir: source,
    sourcefile: 'ropa-vitrine.js',
  },
  outfile: path.join(destination, 'viewers.js'),
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2022', 'chrome120', 'firefox121', 'safari17'],
  legalComments: 'eof',
  banner: { js: `/*! Vitrine ${revision} | MIT | https://github.com/ecrou-exact/vitrine
 * JSON and Markdown viewers. See LICENSE and THIRD_PARTY_NOTICES.md. */` },
  plugins: [{
    name: 'raw-css',
    setup(builder) {
      builder.onResolve({ filter: /\.css\?raw$/ }, args => ({
        path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, '')),
        namespace: 'raw-css',
      }));
      builder.onLoad({ filter: /.*/, namespace: 'raw-css' }, async args => ({
        contents: await readFile(args.path, 'utf8'), loader: 'text',
      }));
    },
  }],
});
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  await copyFile(path.join(source, name), path.join(destination, name));
}
await copyFile(path.join(source, 'src/styles/themes/light.css'), path.join(destination, 'light.css'));
const hashes = await Promise.all(['viewers.js', 'light.css'].map(async name =>
  `${createHash('sha256').update(await readFile(path.join(destination, name))).digest('hex')}  ${name}`));
await writeFile(path.join(destination, 'SHA256SUMS'), hashes.join('\n') + '\n');
