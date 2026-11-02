import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const agents = read('AGENTS.md').split('\n').slice(4).join('\n');
const claude = read('CLAUDE.md').split('\n').slice(4).join('\n');
if (agents !== claude) throw new Error('AGENTS.md 与 CLAUDE.md 正文不同步');
for (const path of ['docs/planning/current.md', 'docs/development/collaboration.md', 'docs/architecture/overview.md', 'docs/deployment/hosting.md', 'docs/features/bootstrap.md']) {
  if (!existsSync(`${root}${path}`)) throw new Error(`缺少文档：${path}`);
}
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
for (const file of files) {
  if (!/\.(md|json|css|tsx?|mjs|ya?ml|dart)$/.test(file) && !['.gitignore', '.editorconfig', '.node-version'].includes(file)) continue;
  const source = read(file);
  if (source.startsWith('\uFEFF') || source.includes('\r') || !source.endsWith('\n')) throw new Error(`编码或换行不正确：${file}`);
  if (file.endsWith('.json')) JSON.parse(source);
}
console.log(`Repository checks passed (${files.length} files).`);
