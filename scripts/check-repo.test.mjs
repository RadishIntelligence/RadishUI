import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkCommit, checkHistory, checkRuleset, checkText, checkWorkflow, markdownTargets, workflowJobs } from './check-repo.mjs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const workflow = read('.github/workflows/pr-check.yml');
const ruleset = () => JSON.parse(read('.github/rulesets/master-protection.json'));

test('文本拒绝 BOM、CRLF、缺少换行、空白、冲突和损坏 JSON', () => {
  checkText('valid.json', '{"ok":true}\n');
  checkText('valid.md', '换行  \n');
  for (const text of ['\uFEFFtext\n', 'text\r\n', 'text', 'text \n', '<<<<<<< HEAD\n']) {
    assert.throws(() => checkText('invalid.mjs', text));
  }
  assert.throws(() => checkText('invalid.json', '{oops}\n'));
});

test('Markdown 检查普通链接与引用定义，忽略围栏代码', () => {
  assert.deepEqual(markdownTargets('[文档](../README.md#标题)\n![图片](<image file.png>)\n[ref]: path.md\n```md\n[示例](not-a-file.md)\n```\n'), ['../README.md#标题', 'image file.png', 'path.md']);
});

test('Ruleset 拒绝直接绕过、弱化检查、错误分支与额外审批', () => {
  checkRuleset(ruleset());
  for (const mutate of [
    (r) => { r.bypass_actors[0].bypass_mode = 'always'; },
    (r) => { r.conditions.ref_name.include.push('refs/heads/dev'); },
    (r) => { r.rules[3].parameters.required_status_checks[0].context = 'placeholder'; },
    (r) => { delete r.rules[3].parameters.required_status_checks[0].integration_id; },
    (r) => { r.rules[3].parameters.required_status_checks[0].integration_id = 8329; },
    (r) => { r.rules[3].parameters.strict_required_status_checks_policy = false; },
    (r) => { r.rules[2].parameters.required_approving_review_count = 1; },
    (r) => { r.rules[2].parameters.allowed_merge_methods.push('squash'); },
    (r) => { r.rules.pop(); },
  ]) {
    const value = ruleset();
    mutate(value);
    assert.throws(() => checkRuleset(value));
  }
});

test('工作流合同拒绝组件遗漏、条件跳过、触发漂移和未固定 Actions', () => {
  checkWorkflow(workflow);
  for (const changed of [
    workflow.replace('needs: [repo-hygiene, web-build]', 'needs: [repo-hygiene]'),
    workflow.replace('    if: always()', '    if: success()'),
    workflow.replace('    name: Web Build', '    if: false\n    name: Web Build'),
    workflow.replace('      - run: npm run type-check\n', ''),
    workflow.replace('  workflow_dispatch:', '  push:\n  workflow_dispatch:'),
    workflow.replace('    branches: [dev, master]', '    branches: [master]'),
    workflow.replace(/actions\/checkout@[a-f0-9]{40}/g, 'actions/checkout@v5'),
    workflow.replace('WEB_BUILD_RESULT: ${{ needs.web-build.result }}', 'WEB_BUILD_RESULT: success'),
  ]) assert.throws(() => checkWorkflow(changed));
});

test('真实聚合 shell 仅接受两个组件均成功，拒绝失败、取消、跳过和缺失结果', () => {
  const directory = mkdtempSync(join(tmpdir(), 'radishui-ci-results-'));
  try {
    const aggregate = workflowJobs(workflow)['candidate-quality'];
    const script = aggregate.split('        run: |\n')[1].split('\n').map((line) => line.replace(/^          /, '')).join('\n');
    for (const repo of ['success', 'failure', 'cancelled', 'skipped', '']) {
      for (const web of ['success', 'failure', 'cancelled', 'skipped', '']) {
        const result = spawnSync('bash', ['-e', '-o', 'pipefail', '-c', script], {
          env: { PATH: process.env.PATH, REPO_HYGIENE_RESULT: repo, WEB_BUILD_RESULT: web, GITHUB_STEP_SUMMARY: join(directory, 'summary') },
          encoding: 'utf8',
        });
        assert.ifError(result.error);
        assert.equal(result.status === 0, repo === 'success' && web === 'success', `${repo}/${web}: ${result.stderr}`);
      }
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('提交校验依据真实父节点识别 merge，不接受伪造标题', () => {
  for (const subject of ['feat(react): add component', 'fix!: 迁移', 'docs: 更新']) checkCommit(subject, 1);
  checkCommit('Merge pull request #3', 2);
  for (const subject of ['update', 'Merge pull request #3', 'fix: ', 'unknown: change']) assert.throws(() => checkCommit(subject, 1));
});

test('PR 完整区间拒绝早先坏提交、已提交空白和无效 base', () => {
  const directory = mkdtempSync(join(tmpdir(), 'radishui-history-'));
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const commit = (subject, content) => {
    writeFileSync(join(directory, 'file.txt'), content);
    git('add', 'file.txt');
    git('-c', 'user.name=Repository Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', subject);
    return git('rev-parse', 'HEAD');
  };
  try {
    git('init', '-q', '-b', 'dev');
    const base = commit('chore: base', 'base\n');
    const good = commit('feat: valid', 'valid\n');
    checkHistory(directory, base, good);
    commit('invalid earlier subject', 'earlier\n');
    const head = commit('fix: valid final subject', 'final\n');
    assert.throws(() => checkHistory(directory, base, head), /invalid earlier subject/);
    assert.throws(() => checkHistory(directory, 'missing-base', head));
    const whitespaceBase = head;
    const whitespaceHead = commit('fix: whitespace', 'trailing \n');
    assert.throws(() => checkHistory(directory, whitespaceBase, whitespaceHead));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
