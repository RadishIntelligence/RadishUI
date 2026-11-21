import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { componentCatalog, componentGroups } from '../apps/docs/src/component-catalog.ts';
import { pilotDocs } from '../apps/docs/src/component-api.generated.ts';
import { behaviorSourceLabels, behaviorTopicLabels } from '../apps/docs/src/component-api-types.ts';

const root = new URL('../', import.meta.url);
const output = new URL('apps/docs/public/llms.txt', root);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

export function buildLlmsText() {
  const primitiveCount = componentCatalog.filter(entry => entry.group === 'primitives').length;
  const componentCount = componentCatalog.length - primitiveCount;
  const lines = [
    '# RadishUI',
    '',
    '> RadishUI 是 RadishIntelligence 的 React 设计系统与组件文档站。当前为 private workspace，尚未发布 npm；导入路径仅在本仓与内部接入中有效。',
    '',
    `- 版本：${pkg.version}`,
    `- 条目：${componentCatalog.length} 个（${componentCount} 个组件 + ${primitiveCount} 个页面原语）`,
    '- 文档：https://ui.radishx.com',
    '',
    '本文件由 `apps/docs/src/component-catalog.ts`、`packages/react/src` 的 props 类型 / JSDoc / 解构默认值、`component-api.ts` 的 API 回退与 `component-behavior.ts` 的行为声明生成；运行 `npm run llms:generate` 更新，`npm run test:catalog` 检查漂移。',
    '',
  ];
  for (const group of componentGroups) {
    const entries = componentCatalog.filter(entry => entry.group === group.id);
    if (entries.length === 0) continue;
    lines.push(`## ${group.label}（${group.labelEn}）`, '');
    for (const entry of entries) {
      const doc = pilotDocs[entry.id];
      if (!doc) throw new Error(`缺少组件契约：${entry.id}`);
      lines.push(`### ${entry.name}`, '');
      lines.push(`- 页面：https://ui.radishx.com/#/components/${entry.id}`);
      lines.push(`- 摘要：${entry.summary}`);
      lines.push('- 导入：', '', '```ts', ...doc.importCode.split('\n'), '```', '');
      lines.push('属性：', '');
      for (const row of doc.api) {
        const name = row.component ? `${row.component}.${row.name}` : row.name;
        const meta = [`类型 \`${row.type}\``];
        if (row.defaultValue) meta.push(`默认 ${row.defaultValue}`);
        if (row.required) meta.push('必填');
        lines.push(`- \`${name}\` — ${meta.join('；')} — ${row.description}`);
      }
      lines.push('', '行为与可访问性：', '');
      for (const item of doc.behavior) lines.push(`- ${behaviorTopicLabels[item.topic]} · ${behaviorSourceLabels[item.source]}：${item.text}`);
      const related = doc.related.map(id => componentCatalog.find(entry => entry.id === id)?.name).filter(Boolean);
      lines.push('', `相关：${related.length ? related.join('、') : '无'}`, '');
    }
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function main() {
  const text = buildLlmsText();
  if (process.argv.includes('--check')) {
    if (!existsSync(output)) throw new Error('apps/docs/public/llms.txt 缺失，请执行 npm run llms:generate');
    if (readFileSync(output, 'utf8') !== text) throw new Error('llms.txt 与组件契约不一致，请执行 npm run llms:generate');
    console.log('llms.txt matches component contracts.');
  } else {
    mkdirSync(fileURLToPath(new URL('apps/docs/public/', root)), { recursive: true });
    writeFileSync(output, text);
    console.log('Generated apps/docs/public/llms.txt.');
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
