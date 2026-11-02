import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('packages/tokens/src/tokens.json', root), 'utf8'));
const names = Object.keys(tokens.light);
if (names.sort().join() !== Object.keys(tokens.dark).sort().join()) throw new Error('亮暗主题 token 必须对应');
for (const group of Object.values(tokens)) {
  for (const [name, value] of Object.entries(group)) {
    if (!/^[a-z][a-z0-9-]*$/.test(name) || typeof value !== 'string' || /[;{}\n]/.test(value)) {
      throw new Error(`无效 token：${name}`);
    }
  }
}
const block = (selector, values) => `${selector} {\n${Object.entries(values).map(([name, value]) => `  --rd-${name}: ${value};`).join('\n')}\n}\n`;
const css = '/* Generated from src/tokens.json. Run npm run tokens:generate. */\n' +
  block(':root', { ...tokens.shared, ...tokens.light }) + '\n' + block('[data-rd-theme="dark"]', tokens.dark);
const output = new URL('packages/tokens/dist/tokens.css', root);
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== css) throw new Error('Token 产物过期，请执行 npm run tokens:generate');
  console.log('Token source and CSS match.');
} else {
  mkdirSync(fileURLToPath(new URL('packages/tokens/dist/', root)), { recursive: true });
  writeFileSync(output, css);
  console.log('Generated token CSS.');
}
