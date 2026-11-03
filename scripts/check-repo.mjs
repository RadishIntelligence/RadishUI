import assert from 'node:assert/strict';
import { readFileSync, existsSync, lstatSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const required = [
  'AGENTS.md', 'CLAUDE.md', 'README.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md',
  '.editorconfig', '.gitattributes', '.gitignore', '.node-version', 'package-lock.json',
  'docs/README.md', 'docs/planning/current.md', 'docs/planning/roadmap.md', 'docs/planning/topics.md',
  'docs/features/token-foundation.md', 'docs/features/react-button.md', 'docs/features/docs-preview.md',
  'docs/development/collaboration.md',
  'docs/development/repository-governance.md', 'docs/development/design-system.md',
  'docs/adr/0001-branch-and-pr-governance.md', 'docs/architecture/overview.md',
  'docs/deployment/hosting.md', 'docs/features/bootstrap.md',
  '.github/PULL_REQUEST_TEMPLATE.md', '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/bug-report.yml', '.github/ISSUE_TEMPLATE/change-proposal.yml',
  '.github/workflows/pr-check.yml', '.github/repository-settings.json',
  '.github/rulesets/master-protection.json', '.github/rulesets/README.md',
  'scripts/check-repo.test.mjs',
];
const git = (args, cwd = root) => execFileSync('git', args, {
  cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
});
const read = (file) => new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
  .decode(readFileSync(resolve(root, file)));

export function checkText(file, source) {
  assert(!source.startsWith('\uFEFF') && !source.includes('\r') && source.endsWith('\n'), `${file}：需 UTF-8 无 BOM、LF 和末尾换行`);
  assert(!/^(<{7}(?: |$)|={7}$|>{7}(?: |$))/m.test(source), `${file}：存在冲突标记`);
  for (const line of source.split('\n')) {
    if (file.endsWith('.md') && /\S {2}$/.test(line)) continue;
    assert(!/[\t ]+$/.test(line), `${file}：存在尾随空白`);
  }
  if (file.endsWith('.json')) JSON.parse(source);
}

export function markdownTargets(source) {
  // 检查文档内普通内联链接和引用定义；跳过围栏代码，不解析外部 URL 或标题锚点。
  const prose = source.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
  return [
    ...prose.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*?["'])?\)/g),
    ...prose.matchAll(/^ {0,3}\[[^\]\n]+\]:\s*(<[^>]+>|\S+)/gm),
  ].map((match) => match[1].replace(/^<|>$/g, ''));
}

export function checkRuleset(ruleset) {
  assert.equal(ruleset.target, 'branch');
  assert.equal(ruleset.enforcement, 'active');
  assert.deepEqual(ruleset.conditions, { ref_name: { include: ['refs/heads/master'], exclude: [] } });
  assert.deepEqual(ruleset.bypass_actors, [{ actor_id: 5, actor_type: 'RepositoryRole', bypass_mode: 'pull_request' }]);
  assert.deepEqual(ruleset.rules.map((rule) => rule.type).sort(), ['deletion', 'non_fast_forward', 'pull_request', 'required_status_checks']);
  const pr = ruleset.rules.find((rule) => rule.type === 'pull_request').parameters;
  assert.deepEqual(pr, {
    allowed_merge_methods: ['merge', 'rebase'], dismiss_stale_reviews_on_push: true,
    require_code_owner_review: false, require_last_push_approval: false,
    required_approving_review_count: 0, required_review_thread_resolution: true,
  });
  const checks = ruleset.rules.find((rule) => rule.type === 'required_status_checks').parameters;
  assert.deepEqual(checks, {
    do_not_enforce_on_create: false, required_status_checks: [{ context: 'Candidate Quality', integration_id: 15368 }],
    strict_required_status_checks_policy: true,
  });
}

export function workflowJobs(source) {
  const body = source.slice(source.indexOf('\njobs:\n') + 7);
  const headers = [...body.matchAll(/^  ([a-z][a-z0-9-]*):\s*$/gm)];
  return Object.fromEntries(headers.map((match, index) => [match[1], body.slice(match.index, headers[index + 1]?.index)]));
}

export function checkWorkflow(source) {
  // 对本仓库的固定 YAML 布局检查关键合同；不是通用 YAML 解析器或工作流安全审计。
  assert(source.includes('\non:\n  pull_request:\n    branches: [dev, master]\n  workflow_dispatch:\n'));
  assert(!/^\s*(push|pull_request_target|workflow_run|paths|paths-ignore):/m.test(source), '不允许扩大触发或按路径跳过');
  assert(source.includes('\npermissions:\n  contents: read\n'));
  assert(!/^\s*(?:[\w-]+: write|secrets:|continue-on-error:|ref:)/m.test(source), '工作流权限或执行边界漂移');
  assert.equal([...source.matchAll(/^\s+if:/gm)].length, 1, '只允许聚合 job 的 always 条件');
  const jobs = workflowJobs(source);
  assert.deepEqual(Object.keys(jobs), ['repo-hygiene', 'web-build', 'candidate-quality']);
  for (const [key, name] of [['repo-hygiene', 'Repo Hygiene'], ['web-build', 'Web Build'], ['candidate-quality', 'Candidate Quality']]) {
    assert(jobs[key].includes(`\n    name: ${name}\n`));
    assert(jobs[key].includes('\n    runs-on: ubuntu-24.04\n'));
    assert(/^    timeout-minutes: [1-9]\d*$/m.test(jobs[key]));
  }
  const uses = [...source.matchAll(/uses: ([^\s#]+)/g)].map((match) => match[1]);
  assert.equal(uses.length, 4);
  assert(uses.every((value) => /^actions\/(checkout|setup-node)@[a-f0-9]{40}$/.test(value)), 'Actions 必须来自官方并固定完整 SHA');
  for (const job of [jobs['repo-hygiene'], jobs['web-build']]) {
    assert(job.includes('persist-credentials: false'));
    assert(job.includes('node-version-file: .node-version'));
    assert(job.includes('package-manager-cache: false'));
  }
  for (const line of [
    'fetch-depth: 0',
    'PR_BASE_SHA: ${{ github.event.pull_request.base.sha }}',
    'PR_HEAD_SHA: ${{ github.event.pull_request.head.sha }}',
    'node scripts/check-repo.mjs --base-ref "$PR_BASE_SHA" --head-ref "$PR_HEAD_SHA"',
    'npm run check:repo', 'npm run test:repo',
  ]) assert(jobs['repo-hygiene'].includes(line), `Repo Hygiene 缺少 ${line}`);
  for (const command of ['npm ci', 'npm run check:tokens', 'npm run type-check', 'npm run build --workspace @radish-ui/docs']) {
    assert(jobs['web-build'].includes(`      - run: ${command}\n`), `Web Build 缺少 ${command}`);
  }
  const aggregate = jobs['candidate-quality'];
  for (const line of [
    '    if: always()\n', '    needs: [repo-hygiene, web-build]\n',
    'REPO_HYGIENE_RESULT: ${{ needs.repo-hygiene.result }}',
    'WEB_BUILD_RESULT: ${{ needs.web-build.result }}',
    '          test "$REPO_HYGIENE_RESULT" = success\n',
    '          test "$WEB_BUILD_RESULT" = success\n',
  ]) assert(aggregate.includes(line), `聚合合同缺少 ${line.trim()}`);
}

export function checkCommit(subject, parentCount) {
  if (parentCount > 1) return; // Git 真实 merge commit；不以标题猜测。
  assert(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^\s()]+\))?!?: \S.*$/.test(subject), `提交不符合 Conventional Commits：${subject}`);
}

export function checkHistory(cwd, baseRef, headRef = 'HEAD') {
  const sha = (ref) => {
    assert(ref && !ref.startsWith('-'), '无效 Git ref');
    return git(['rev-parse', '--verify', `${ref}^{commit}`], cwd).trim();
  };
  const base = sha(baseRef);
  const head = sha(headRef);
  // PR diff 从 merge-base 计算；不只检查最后一个提交。合并候选还包含目标分支组合。
  git(['diff', '--check', `${base}...HEAD`], cwd);
  for (const line of git(['log', '--format=%H%x09%P%x09%s', `${base}..${head}`], cwd).trim().split('\n').filter(Boolean)) {
    const [commit, parents, ...subject] = line.split('\t');
    try { checkCommit(subject.join('\t'), parents.split(' ').filter(Boolean).length); }
    catch (error) { throw new Error(`${commit.slice(0, 12)}：${error.message}`); }
  }
}

function main() {
  const args = process.argv.slice(2);
  const options = {};
  while (args.length) {
    const key = args.shift();
    assert(['--base-ref', '--head-ref'].includes(key) && args[0] && !Object.hasOwn(options, key), `未知或缺失参数：${key}`);
    options[key] = args.shift();
  }
  assert(!options['--head-ref'] || options['--base-ref'], '--head-ref 需要 --base-ref');
  for (const file of required) assert(existsSync(resolve(root, file)), `缺少必需文件：${file}`);
  assert.equal(read('AGENTS.md').split('\n').slice(4).join('\n'), read('CLAUDE.md').split('\n').slice(4).join('\n'), '协作入口不同步');
  const files = new Set(git(['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0').filter(Boolean));
  for (const file of files) {
    if (!existsSync(resolve(root, file))) continue; // 已删除的非必需文件不再读取。
    assert(!lstatSync(resolve(root, file)).isSymbolicLink(), `仓库源文件不应是符号链接：${file}`);
    if (!/\.(md|json|css|tsx?|mjs|ya?ml|dart|html)$/.test(file) && !['.gitignore', '.gitattributes', '.editorconfig', '.node-version'].includes(file)) continue;
    const source = read(file);
    checkText(file, source);
    if (file.endsWith('.md')) for (const target of markdownTargets(source)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) continue;
      const path = decodeURIComponent(target.split(/[?#]/)[0]);
      if (!path) continue;
      const destination = resolve(root, dirname(file), path);
      const inside = relative(root, destination);
      assert(!inside.startsWith('..') && !inside.startsWith('/'), `${file}：链接超出仓库 ${target}`);
      assert(existsSync(destination), `${file}：无效相对链接 ${target}`);
    }
  }
  checkRuleset(JSON.parse(read('.github/rulesets/master-protection.json')));
  checkWorkflow(read('.github/workflows/pr-check.yml'));
  assert.deepEqual(JSON.parse(read('.github/repository-settings.json')), {
    default_branch: 'master', allow_merge_commit: true, allow_rebase_merge: true,
    allow_squash_merge: false, delete_branch_on_merge: false,
  });
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.engines.node, '24.x');
  assert(/^24\.\d+\.\d+$/.test(read('.node-version').trim()), '.node-version 应固定 Node 24 的完整版本');
  assert.equal(pkg.scripts['check:repo'], 'node scripts/check-repo.mjs');
  assert.equal(pkg.scripts['test:repo'], 'node --test scripts/check-repo.test.mjs');
  assert.equal(pkg.scripts.check, 'npm run check:repo && npm run test:repo && npm run check:tokens && npm run type-check');
  assert.equal(pkg.scripts.build, 'npm run check && npm run build --workspace @radish-ui/docs');
  const pr = read('.github/PULL_REQUEST_TEMPLATE.md');
  for (const text of ['token / API / 默认视觉 / 平台支持', '未验证范围', '回流负责人和时机', 'origin/master origin/dev', 'Vercel 生产部署']) assert(pr.includes(text), `PR 模板缺少 ${text}`);
  assert(read('.github/ISSUE_TEMPLATE/config.yml').includes('https://github.com/RadishIntelligence/RadishUI/blob/master/SECURITY.md'));
  git(['diff', '--check']);
  git(['diff', '--cached', '--check']);
  if (options['--base-ref']) checkHistory(root, options['--base-ref'], options['--head-ref']);
  console.log(`Repository checks passed (${files.size} files${options['--base-ref'] ? ', including PR history' : ''}).`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
