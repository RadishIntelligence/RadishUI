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

test('全部组件页可加载，行为表与高亮齐全', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/#/catalog');
  await page.waitForFunction(() => document.querySelectorAll('a.catalog-card[href^="#/components/"]').length === 31);
  const hrefs = await page.locator('a.catalog-card[href^="#/components/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  const ids = [...new Set(hrefs.map(href => href.replace('#/components/', '')))];
  expect(ids.length).toBe(31);
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
    const behaviorRows = await page.locator('.doc-behavior tbody tr').count();
    if (behaviorRows < 3) failures.push(`${id}: 行为表 ${behaviorRows} 行`);
    const unhighlighted = await page.locator('.doc-code pre code').evaluateAll(nodes => nodes.filter(node => !node.querySelector('span[class^="tok-"]')).length);
    if (unhighlighted) failures.push(`${id}: ${unhighlighted} 个代码块无高亮`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${id}: 1440 页面横向溢出`);
    if (errors.length) failures.push(`${id}: ${errors.join(' | ')}`);
    page.off('pageerror', onError);
  }
  expect(failures).toEqual([]);
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
