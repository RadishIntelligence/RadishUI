import { test, expect } from '@playwright/test';

// Browser-level regression assertions for the generated component site. Each test drives
// a shipped page; shared-component keyboard and focus rules come from the behavior
// declarations in component-behavior.ts, so an implementation change that breaks a
// documented rule fails here instead of only in a one-off probe.

async function openComponent(page, id) {
  await page.goto(`/#/components/${id}`);
  const root = page.locator(`[data-component="${id}"]`);
  await expect(root).toBeVisible();
  return root;
}

const example = (root, id) => root.locator(`[data-example="${id}"]`);

async function componentIds(page) {
  await page.goto('/#/catalog');
  await page.waitForFunction(() => document.querySelectorAll('a.catalog-card[href^="#/components/"]').length === 34);
  const hrefs = await page.locator('a.catalog-card[href^="#/components/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  return [...new Set(hrefs.map(href => href.replace('#/components/', '')))];
}

test('Button 的 loading 保留焦点，disabled 不可交互', async ({ page }) => {
  const root = await openComponent(page, 'button');
  const states = example(root, 'states');
  const loading = states.getByRole('button', { name: '保存中' });
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await expect(loading).toHaveAttribute('aria-disabled', 'true');
  await expect(loading).not.toHaveAttribute('disabled');
  await loading.focus();
  await page.keyboard.press('Enter');
  await expect(loading).toBeFocused();
  await expect(states.getByRole('button', { name: '不可用' })).toBeDisabled();
});

test('Tabs 方向键切换并跳过禁用项', async ({ page }) => {
  const root = await openComponent(page, 'tabs');
  const tabs = example(root, 'disabled');
  const list = tabs.getByRole('tablist', { name: '带禁用项的标签组' });
  const overview = list.getByRole('tab', { name: '概览' });
  const history = list.getByRole('tab', { name: '历史' });
  const locked = list.getByRole('tab', { name: '不可用' });
  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await expect(locked).toBeDisabled();
  await overview.focus();
  await page.keyboard.press('ArrowRight');
  await expect(history).toBeFocused();
  await expect(history).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(overview).toBeFocused();
  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await expect(locked).toHaveAttribute('aria-selected', 'false');
});

test('Select 键盘选择、受控值同步与 Escape 回焦', async ({ page }) => {
  const root = await openComponent(page, 'select');
  const basic = example(root, 'basic').locator('.doc-preview');
  // Radix hides the page content from assistive technology while the popup is open,
  // so the trigger is addressed by its DOM role instead of the accessible-role engine.
  const trigger = basic.locator('[role="combobox"]');
  const listbox = page.getByRole('listbox');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(listbox).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden();
  await expect(trigger).toContainText('文档');
  await expect(basic).toContainText('当前值：document');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(listbox).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(listbox).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('ToggleGroup 单选方向键同步选中', async ({ page }) => {
  const root = await openComponent(page, 'toggle-group');
  const single = example(root, 'single');
  const items = single.getByRole('radiogroup', { name: '视图' }).getByRole('radio');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toHaveAttribute('aria-checked', 'true');
  await items.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(items.nth(1)).toBeFocused();
  await expect(items.nth(1)).toHaveAttribute('aria-checked', 'true');
  await expect(items.nth(0)).toHaveAttribute('aria-checked', 'false');
});

test('Dialog 初始焦点与 Escape 回焦', async ({ page }) => {
  const root = await openComponent(page, 'dialog');
  const focusDemo = example(root, 'focus');
  const trigger = focusDemo.getByRole('button', { name: '重命名资源' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '重命名资源' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: '资源名称' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Checkbox 与 Switch 的键盘切换', async ({ page }) => {
  const checkboxRoot = await openComponent(page, 'checkbox');
  const checkbox = example(checkboxRoot, 'basic').getByRole('checkbox', { name: '接收发布通知' });
  await expect(checkbox).not.toBeChecked();
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  const switchRoot = await openComponent(page, 'switch');
  const toggle = example(switchRoot, 'basic').getByRole('switch', { name: '接收通知' });
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
});

test('复制按钮取到纯文本源码', async ({ page }) => {
  await openComponent(page, 'button');
  const block = page.locator('.doc-code').first();
  const source = await block.locator('pre code').evaluate(element => element.textContent);
  await block.getByRole('button').click();
  await expect(block.getByRole('button')).toContainText('已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
});

test.describe('强制颜色', () => {
  test.use({ forcedColors: 'active' });

  test('分页当前页与标签选中保留系统色轮廓', async ({ page }) => {
    const pagination = await openComponent(page, 'pagination');
    const current = example(pagination, 'basic').locator('.rd-pagination__number[aria-current="page"]').first();
    const outline = await current.evaluate(element => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBe('2px');
    const tabs = await openComponent(page, 'tabs');
    const active = example(tabs, 'basic').locator('.rd-tab[data-state="active"]').first();
    const before = await active.evaluate(element => getComputedStyle(element, '::before').borderTopWidth);
    expect(before).toBe('2px');
  });
});

test('全部组件页可加载，结构、行为表与高亮齐全', async ({ page }) => {
  test.setTimeout(120_000);
  const ids = await componentIds(page);
  expect(ids.length).toBe(34);
  const failures = [];
  for (const id of ids) {
    const errors = [];
    const onError = error => errors.push(String(error));
    page.on('pageerror', onError);
    await page.goto(`/#/components/${id}`);
    const root = page.locator(`[data-component="${id}"]`);
    try {
      await expect(root).toBeVisible({ timeout: 15_000 });
    } catch {
      failures.push(`${id}: 页面未渲染`);
    }
    if (await root.count() === 0) { page.off('pageerror', onError); continue; }
    const structure = await root.evaluate(node => {
      const examples = node.querySelectorAll('[data-example]').length;
      return {
        examples,
        apiRows: node.querySelectorAll('.doc-api tbody tr').length,
        behaviorRows: node.querySelectorAll('.doc-behavior tbody tr').length,
        copyButtons: node.querySelectorAll('.doc-code button').length,
        outlineLinks: node.querySelectorAll('.component-doc__aside .rd-toc a').length,
        sections: ['doc-import', 'doc-examples', 'doc-api', 'doc-keyboard'].filter(section => node.querySelector(`#${section}`)).length,
        importCode: node.querySelector('.doc-section[aria-labelledby="doc-import"] .doc-code pre code')?.textContent?.trim() ?? '',
        related: node.querySelectorAll('.doc-related__link').length,
      };
    });
    if (!structure.importCode.startsWith('import')) failures.push(`${id}: 导入代码缺失`);
    if (structure.examples < 3) failures.push(`${id}: 示例 ${structure.examples} 个`);
    if (structure.apiRows < 2) failures.push(`${id}: API ${structure.apiRows} 行`);
    if (structure.behaviorRows < 3) failures.push(`${id}: 行为表 ${structure.behaviorRows} 行`);
    if (structure.sections !== 4) failures.push(`${id}: 章节 ${structure.sections}/4`);
    if (structure.copyButtons !== structure.examples + 1) failures.push(`${id}: 复制按钮 ${structure.copyButtons} 个`);
    const expectedOutline = structure.related > 0 ? 5 : 4;
    if (structure.outlineLinks !== expectedOutline) failures.push(`${id}: 目录 ${structure.outlineLinks} 项`);
    const unhighlighted = await page.locator('.doc-code pre code').evaluateAll(nodes => nodes.filter(node => !node.querySelector('span[class^="tok-"]')).length);
    if (unhighlighted) failures.push(`${id}: ${unhighlighted} 个代码块无高亮`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${id}: 1440 页面横向溢出`);
    if (errors.length) failures.push(`${id}: ${errors.join(' | ')}`);
    page.off('pageerror', onError);
  }
  expect(failures).toEqual([]);
});

test('全部组件页在 390 无页面级横向溢出', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const ids = await componentIds(page);
  const failures = [];
  for (const id of ids) {
    const errors = [];
    const onError = error => errors.push(String(error));
    page.on('pageerror', onError);
    await page.goto(`/#/components/${id}`);
    try {
      await expect(page.locator(`[data-component="${id}"]`)).toBeVisible({ timeout: 15_000 });
    } catch {
      failures.push(`${id}: 页面未渲染`);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${id}: 390 页面横向溢出`);
    if (errors.length) failures.push(`${id}: ${errors.join(' | ')}`);
    page.off('pageerror', onError);
  }
  expect(failures).toEqual([]);
});

test('暗色代表页无横向溢出并应用暗色主题', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ colorScheme: 'dark' });
  const targets = [
    ['#/components/button', '[data-component="button"]'],
    ['#/components/table', '[data-component="table"]'],
    ['#/components/description-list', '[data-component="description-list"]'],
    ['#/resources', '.resources-page'],
    ['#/changelog', '.changelog-page'],
    ['#/icons', '.icons-page'],
    ['#/search', '.search-page'],
  ];
  const failures = [];
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const [hash, selector] of targets) {
      const errors = [];
      const onError = error => errors.push(String(error));
      page.on('pageerror', onError);
      await page.goto(`/${hash}`);
      try {
        await expect(page.locator(selector)).toBeVisible({ timeout: 15_000 });
      } catch {
        failures.push(`${width} ${hash}: 页面未渲染`);
        page.off('pageerror', onError);
        continue;
      }
      const state = await page.evaluate(() => ({
        theme: document.documentElement.dataset.rdTheme,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      }));
      if (state.theme !== 'dark') failures.push(`${width} ${hash}: 主题 ${state.theme}`);
      if (state.overflow) failures.push(`${width} ${hash}: 横向溢出`);
      if (errors.length) failures.push(`${width} ${hash}: ${errors.join(' | ')}`);
      page.off('pageerror', onError);
    }
  }
  expect(failures).toEqual([]);
});

test('组件页目录跳转章节并保持当前项', async ({ page }) => {
  const root = await openComponent(page, 'description-list');
  const outline = root.locator('.component-doc__aside .rd-toc');
  await expect(outline).toBeVisible();
  await expect(outline.getByRole('link')).toHaveCount(5);
  await expect(outline.getByRole('link', { name: '导入' })).toHaveAttribute('aria-current', 'location');
  await outline.getByRole('link', { name: 'API' }).click();
  await expect(page).toHaveURL(/#\/components\/description-list\/doc-api$/);
  await expect(outline.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => page.locator('#doc-api').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(400);
  await page.reload();
  await expect(page.locator('[data-component="description-list"]')).toBeVisible();
  await expect(page.locator('#doc-api')).toBeVisible();
  await expect(page.locator('.component-doc__aside .rd-toc a[aria-current="location"]')).toHaveText('API');
});

test('组件页窄屏目录使用抽屉并跳转章节', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openComponent(page, 'description-list');
  await expect(page.locator('.component-doc__aside')).toBeHidden();
  const trigger = page.locator('.component-doc__outline-trigger');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const drawer = page.locator('.component-doc__outline-drawer');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('link')).toHaveCount(5);
  await drawer.getByRole('link', { name: '键盘与可访问性' }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/#\/components\/description-list\/doc-keyboard$/);
  await expect.poll(() => page.locator('#doc-keyboard').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(400);
});


test('站点搜索按类型分组、可跳转并在窄屏保持无溢出', async ({ page }) => {
  await page.goto('/#/search');
  await expect(page.getByRole('heading', { level: 1, name: '搜索' })).toBeVisible();
  await expect(page.locator('.search-summary-card')).toHaveCount(4);
  await expect(page.locator('.search-count')).toHaveText('共 89 个条目');
  const input = page.getByLabel('搜索站点');
  await input.fill('button');
  await expect(page.locator('.search-count')).toHaveText('3 个结果');
  await expect(page.locator('.search-group')).toHaveCount(2);
  await expect(page.locator('.search-result')).toHaveCount(3);
  await page.keyboard.press('Tab');
  await expect(page.locator('.search-result').first()).toBeFocused();
  await page.locator('.search-result', { hasText: 'Button' }).first().click();
  await expect(page).toHaveURL(/#\/components\/button$/);
  await expect(page.locator('[data-component="button"]')).toBeVisible();

  await page.goto('/#/search');
  await page.getByLabel('搜索站点').fill('ArrowLeft');
  await expect(page.locator('.search-count')).toHaveText('1 个结果');
  await expect(page.locator('.search-result')).toHaveCount(1);
  await page.locator('.search-result', { hasText: 'ArrowLeft' }).click();
  await expect(page).toHaveURL(/#\/icons$/);
  await expect(page.getByRole('heading', { level: 1, name: '图标参考' })).toBeVisible();

  await page.goto('/#/search');
  const search = page.getByLabel('搜索站点');
  await search.fill('没有这个条目');
  await expect(page.locator('.search-empty')).toHaveText('没有匹配的条目。');
  await search.fill('');
  await expect(page.locator('.search-summary-card')).toHaveCount(4);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/search');
  await search.fill('表单');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, '搜索页在 390 下横向溢出').toBe(false);
});

test('变更记录页展示内部版本并链接到组件页', async ({ page }) => {
  await page.goto('/#/changelog');
  await expect(page.getByRole('heading', { level: 1, name: '变更记录' })).toBeVisible();
  await expect(page.locator('.changelog-version')).toContainText('v26.11.1');
  const entries = page.locator('.changelog-entry');
  await expect(entries).toHaveCount(7);
  await expect(entries.first()).toContainText('2026-11-25');
  const componentLink = page.locator('.changelog-entry a[href="#/components/description-list"]').first();
  await expect(componentLink).toBeVisible();
  await componentLink.click();
  await expect(page).toHaveURL(/#\/components\/description-list$/);
  await expect(page.locator('[data-component="description-list"]')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/changelog');
  await expect(page.locator('.changelog-page')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, '变更记录页在 390 下横向溢出').toBe(false);
  await expect(page.locator('.changelog-entry')).toHaveCount(7);
});

test('图标参考页可搜索、复制导入且窄屏无溢出', async ({ page }) => {
  await page.goto('/#/icons');
  await expect(page.getByRole('heading', { level: 1, name: '图标参考' })).toBeVisible();
  const cards = page.locator('.icon-card');
  await expect(cards).toHaveCount(38);
  const search = page.getByLabel('搜索图标');
  await search.fill('arrow');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('.icons-count')).toHaveText('共 3 个图标');
  await search.fill('没有这个图标');
  await expect(page.locator('.icons-empty')).toHaveText('没有匹配的图标。');
  await search.fill('');
  await expect(cards).toHaveCount(38);
  const first = cards.first();
  await first.getByRole('button').click();
  await expect(first.getByRole('button')).toContainText('已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/^import \{ [A-Za-z0-9]+ \} from 'lucide-react';$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/icons');
  await expect(page.locator('.icons-page')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, '图标参考页在 390 下横向溢出').toBe(false);
});

test('窄屏组件页无页面级横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of ['button', 'select', 'form', 'table']) {
    await openComponent(page, id);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `${id} 在 390 下横向溢出`).toBe(false);
  }
});

test('Form 提交前校验并把焦点移到首个错误字段', async ({ page }) => {
  const root = await openComponent(page, 'form');
  const basic = example(root, 'basic');
  const input = basic.getByRole('textbox');
  const submit = basic.getByRole('button', { name: '创建资源' });
  await submit.click();
  await expect(input).toBeFocused();
  await expect(basic.getByRole('alert')).toHaveText('请输入资源名称。');
  await input.fill('发布检查清单');
  await expect(basic.getByRole('alert')).toHaveCount(0);
  await submit.click();
  await expect(basic).toContainText('已创建：发布检查清单');
});

test('Form 多个错误时聚焦 DOM 顺序中的第一个字段', async ({ page }) => {
  const root = await openComponent(page, 'form');
  const focusOrder = example(root, 'focus-order');
  const name = focusOrder.getByRole('textbox').first();
  await focusOrder.getByRole('button', { name: '保存' }).click();
  await expect(name).toBeFocused();
  await expect(focusOrder.getByRole('alert')).toHaveCount(2);
});



test('Empty 组件页与目录 / 资源空态采用', async ({ page }) => {
  const root = await openComponent(page, 'empty');
  await expect(example(root, 'basic').locator('.rd-empty__title')).toHaveText('没有匹配的资源');
  await expect(example(root, 'basic').locator('.rd-empty__icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(example(root, 'inline').locator('.rd-empty')).toHaveAttribute('data-align', 'start');
  await expect(example(root, 'fill').locator('.rd-empty')).toHaveAttribute('data-fill', 'true');
  await page.goto('/#/catalog');
  await page.getByLabel('搜索组件').fill('没有这个组件');
  await expect(page.locator('.rd-empty__title')).toHaveText('没有匹配的组件。');
  await page.getByRole('button', { name: '清除搜索' }).click();
  await expect(page.locator('a.catalog-card')).toHaveCount(34);
  await page.goto('/#/resources');
  await page.getByLabel('搜索资源').fill('没有这个资源');
  await expect(page.locator('.rd-empty__title')).toHaveText('没有匹配的资源');
  await page.getByRole('button', { name: '清除筛选' }).click();
  await expect(page.locator('.resource-table tbody tr').first()).toBeVisible();
});

test('InputNumber 方向键、失焦钳制与 Tab 顺序', async ({ page }) => {
  const root = await openComponent(page, 'input-number');
  const basic = example(root, 'basic');
  const number = basic.getByRole('spinbutton');
  await expect(number).toHaveAttribute('aria-valuenow', '3');
  await number.focus();
  await page.keyboard.press('ArrowUp');
  await expect(number).toHaveValue('4');
  await expect(basic).toContainText('当前数量：4');
  await number.fill('99');
  await page.keyboard.press('Tab');
  await expect(number).toHaveValue('10');
  await expect(number).toHaveAttribute('aria-valuenow', '10');
  await expect(basic.getByRole('button', { name: '增加数量' })).toBeDisabled();
  await expect(basic.getByRole('button', { name: '减少数量' })).toBeEnabled();
  await number.focus();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.className ?? '')).not.toContain('rd-input-number__controls');

  const step = example(root, 'step').getByRole('spinbutton');
  await expect(step).toHaveValue('12.5');
  await step.focus();
  await page.keyboard.press('ArrowUp');
  await expect(step).toHaveValue('13');
  await expect(example(root, 'step')).toContainText('当前价格：13.0');
  await expect(example(root, 'field').getByRole('alert')).toHaveText('每页条数需在 5–50 之间。');
});

test('设置页每页条数保存后由资源库分页消费', async ({ page }) => {
  await page.goto('/#/settings');
  const input = page.getByLabel('资源库每页条数');
  await expect(input).toHaveValue('20');
  await input.fill('5');
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: '保存更改' }).click();
  await expect(page.getByText('所有更改已保存')).toBeVisible();
  await page.goto('/#/resources');
  await expect(page.locator('.resource-table tbody tr')).toHaveCount(5);
});

test('version 2 偏好迁移到 v3 并补默认每页条数', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('radishui.preferences.v1', JSON.stringify({
    version: 2,
    data: { theme: 'dark', locale: 'zh-CN', density: 'compact', fontSize: 'standard', showToc: true, lineHeight: 'standard', notifications: true },
  })));
  await page.goto('/#/settings');
  await expect(page.locator('html')).toHaveAttribute('data-rd-theme', 'dark');
  const input = page.getByLabel('资源库每页条数');
  await expect(input).toHaveValue('20');
  await input.fill('5');
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: '保存更改' }).click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('radishui.preferences.v1')));
  expect(stored.version).toBe(3);
  expect(stored.data.pageSize).toBe(5);
});

test('工作台资源新建表单校验与提交', async ({ page }) => {
  await page.goto('/#/resources');
  await page.getByRole('button', { name: '新建资源' }).click();
  const dialog = page.getByRole('dialog', { name: '新建资源' });
  await expect(dialog).toBeVisible();
  const name = dialog.getByRole('textbox', { name: '资源名称' });
  await expect(name).toBeFocused();
  await dialog.getByRole('button', { name: '创建资源' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('请输入资源名称。');
  await expect(name).toBeFocused();
  await name.fill('浏览器断言资源');
  await dialog.getByRole('button', { name: '创建资源' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('table').getByText('浏览器断言资源')).toBeVisible();
});

test('工作台文档编辑表单校验与保存', async ({ page }) => {
  await page.goto('/#/document/button-guidelines');
  await page.getByRole('button', { name: '编辑文档' }).click();
  const title = page.getByRole('textbox', { name: '文档标题' });
  await title.fill('');
  await page.getByRole('button', { name: '保存文档' }).click();
  await expect(page.getByRole('alert')).toHaveText('请输入文档标题。');
  await expect(title).toBeFocused();
  await title.fill('Button 使用规范（回归）');
  await page.getByRole('button', { name: '保存文档' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Button 使用规范（回归）' })).toBeVisible();
});

test('DescriptionList 使用原生 dl 语义并承接工作台详情', async ({ page }) => {
  const root = await openComponent(page, 'description-list');
  const list = example(root, 'basic').locator('dl.rd-description-list');
  await expect(list).toBeVisible();
  await expect(list.locator('dt')).toHaveCount(4);
  await expect(list.locator('dd')).toHaveCount(4);
  await expect(list.locator('dt').first()).toHaveText('类型');
  await expect(list.locator('dd').first()).toHaveText('文档');
  await expect(example(root, 'values').locator('.doc-preview').getByText('已发布')).toBeVisible();
  await page.goto('/#/resources');
  await page.locator('.resource-select').first().click();
  const detail = page.locator('.resource-detail');
  await expect(detail.locator('dl.rd-description-list dt')).toHaveCount(4);
});

test('Drawer 底部编排共用同一合同并保持焦点回焦', async ({ page }) => {
  const root = await openComponent(page, 'drawer');
  const bottom = example(root, 'bottom');
  const trigger = bottom.getByRole('button', { name: '打开底部抽屉' });
  await trigger.click();
  const sheet = page.locator('.rd-drawer--bottom');
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(400);
  const box = await sheet.boundingBox();
  const viewport = page.viewportSize();
  expect(box.y + box.height).toBeCloseTo(viewport.height, 0);
  expect(box.width).toBeLessThan(viewport.width - 32);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('工作台窄屏资源详情使用底部抽屉', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/resources');
  const select = page.locator('.resource-mobile-select').first();
  await select.click();
  const sheet = page.locator('.rd-drawer--bottom');
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(400);
  const box = await sheet.boundingBox();
  expect(box.y + box.height).toBeCloseTo(844, 0);
  expect(Math.round(box.width)).toBe(390);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(select).toBeFocused();
});

test('工作台 800–1099 资源详情保持侧向抽屉', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/#/resources');
  await page.getByRole('table').getByRole('button').first().click();
  const side = page.locator('.rd-drawer:not(.rd-drawer--bottom)');
  await expect(side).toBeVisible();
  await expect(page.locator('.rd-drawer--bottom')).toHaveCount(0);
  await page.waitForTimeout(400);
  const box = await side.boundingBox();
  expect(page.viewportSize().width - (box.x + box.width)).toBeCloseTo(8, 0);
  await page.keyboard.press('Escape');
  await expect(side).toBeHidden();
});

test('英文语言下目录、组件页与搜索使用英文文案', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('radishui.preferences.v1', JSON.stringify({
    version: 3,
    data: { theme: 'light', locale: 'en', density: 'standard', fontSize: 'standard', showToc: true, lineHeight: 'standard', notifications: true, pageSize: 20 },
  })));
  const chinese = /[\u4e00-\u9fff]/;
  await page.goto('/#/catalog');
  await expect(page.getByRole('heading', { level: 1, name: 'Component catalog' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const buttonCard = page.locator('a.catalog-card[href="#/components/button"]');
  await expect(buttonCard.locator('.catalog-card__group')).toHaveText('Actions');
  expect(await buttonCard.locator('.catalog-card__summary').innerText(), 'Button 摘要仍是中文').not.toMatch(chinese);
  await expect(page.locator('.catalog-group__head h2').first()).toHaveText('Actions');

  await page.goto('/#/components/button');
  const root = page.locator('[data-component="button"]');
  await expect(root).toBeVisible();
  expect(await root.locator('.component-doc__summary').innerText(), '组件页摘要仍是中文').not.toMatch(chinese);
  expect(await root.locator('.doc-example').first().locator('.doc-example__head').innerText(), '示例标题 / 说明仍是中文').not.toMatch(chinese);

  await page.goto('/#/search');
  await expect(page.locator('.search-count')).toHaveText('89 entries');
  await page.getByLabel('Search the site').fill('button');
  await expect(page.locator('.search-result')).toHaveCount(5);
  const descriptions = await page.locator('.search-result-desc').allInnerTexts();
  expect(descriptions.every(text => !chinese.test(text)), '英文搜索结果说明仍是中文').toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/catalog');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), '英文目录在 390 下横向溢出').toBe(false);
  await page.goto('/#/components/button');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), '英文组件页在 390 下横向溢出').toBe(false);
});
