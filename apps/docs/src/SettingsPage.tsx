import { useEffect, useState, type FormEvent } from 'react';
import { Button, Checkbox, FormField, InlineAlert, Select, Switch, Tabs, TabsContent, TabsList } from '@radish-ui/react';
import { Check, Info, SlidersHorizontal } from 'lucide-react';
import { defaultPreferences, type Preferences, type Translate } from './model';

interface SettingsPageProps {
  preferences: Preferences; save(next: Preferences): string | undefined; t: Translate; onDirtyChange(dirty: boolean): void;
}
export function SettingsPage({ preferences, save, t, onDirtyChange }: SettingsPageProps) {
  const [draft, setDraft] = useState(preferences);
  const [tab, setTab] = useState('appearance');
  const [error, setError] = useState<string>();
  const dirty = JSON.stringify(draft) !== JSON.stringify(preferences);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);
  useEffect(() => setDraft(preferences), [preferences]);
  function change<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setDraft(current => ({ ...current, [key]: value })); setError(undefined);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const failure = save(draft);
    setError(failure);
    if (!failure) onDirtyChange(false);
  }
  return <section className="settings-page">
    <div className="page-title"><h1>{t('外观与偏好', 'Appearance & preferences')}</h1></div>
    <Tabs value={tab} onValueChange={setTab} className="settings-tabs">
      <TabsList label={t('偏好分组', 'Preference sections')} items={[
        { value: 'appearance', label: t('外观', 'Appearance') }, { value: 'reading', label: t('阅读', 'Reading') }, { value: 'notifications', label: t('通知', 'Notifications') },
      ]} />
      <div className="settings-layout">
        <form className={`settings-form${draft.hints ? '' : ' is-no-hints'}`} onSubmit={submit}>
          <TabsContent value="appearance">
            <div className="theme-fieldset" role="radiogroup" aria-labelledby="interface-theme">
              <span className="theme-heading" id="interface-theme">{t('界面主题', 'Interface theme')}</span>
              {draft.hints && <p className="field-help">{t('选择浅色、深色，或跟随设备外观。', 'Choose light, dark, or follow your device.')}</p>}
              <div className="theme-options">
                {(['light', 'dark', 'system'] as const).map(theme => <label key={theme} className={`theme-option ${draft.theme === theme ? 'is-selected' : ''}`}>
                  <input type="radio" name="theme" value={theme} checked={draft.theme === theme} onChange={() => change('theme', theme)} />
                  <span className="theme-preview" data-rd-theme={theme === 'system' ? undefined : theme} aria-hidden="true">
                    <span className="theme-preview-rail"><b /><i className="is-active" /><i /><i /></span>
                    <span className="theme-preview-main"><span className="theme-preview-bar is-title" /><span className="theme-preview-bar" /><span className="theme-preview-bar is-short" /><span className="theme-preview-button" /></span>
                  </span>
                  <span className="theme-option-caption">{{ light: t('浅色', 'Light'), dark: t('深色', 'Dark'), system: t('跟随系统', 'System') }[theme]}{draft.theme === theme && <Check size={14} aria-hidden="true" />}</span>
                </label>)}
              </div>
            </div>
            <FormField className="preference-field" id="interface-language" label={t('界面语言', 'Interface language')} hint={draft.hints ? t('用于导航、按钮与辅助信息。', 'Used for navigation, controls, and help.') : undefined}>
              <Select value={draft.locale} onValueChange={value => change('locale', value as Preferences['locale'])} options={[{ value: 'zh-CN', label: '简体中文' }, { value: 'en', label: 'English' }]} />
            </FormField>
            <FormField className="preference-field" id="display-density" label={t('显示密度', 'Display density')} hint={draft.hints ? t('标准为默认；调整控件与工作区留白。', 'Standard is the default; adjusts controls and workspace spacing.') : undefined}>
              <Select value={draft.density} onValueChange={value => change('density', value as Preferences['density'])} options={[
                { value: 'compact', label: t('紧凑', 'Compact') }, { value: 'standard', label: t('标准', 'Standard') }, { value: 'spacious', label: t('宽松', 'Spacious') },
              ]} />
            </FormField>
            <FormField className="preference-field" id="reading-font-size" label={t('正文字号', 'Reading font size')} hint={draft.hints ? t('仅调整阅读内容，界面控件保持稳定。', 'Changes article text, while controls stay consistent.') : undefined}>
              <Select value={draft.fontSize} onValueChange={value => change('fontSize', value as Preferences['fontSize'])} options={[
                { value: 'small', label: t('小 · 15 px', 'Small · 15 px') }, { value: 'standard', label: t('标准 · 16 px', 'Standard · 16 px') }, { value: 'large', label: t('大 · 18 px', 'Large · 18 px') },
              ]} />
            </FormField>
            <FormField className="preference-field switch-field" id="show-hints" label={t('显示辅助说明', 'Show field help')} hint={draft.hints ? t('在字段旁显示必要的上下文。', 'Show supporting context beside fields.') : undefined}>
              <Switch id="show-hints" checked={draft.hints} onCheckedChange={value => change('hints', value)} />
            </FormField>
          </TabsContent>
          <TabsContent value="reading">
            <FormField className="preference-field" id="paragraph-spacing" label={t('段落行距', 'Paragraph line height')} hint={draft.hints ? t('应用到文档阅读页。', 'Applied to the document reader.') : undefined}>
              <Select value={draft.lineHeight} onValueChange={value => change('lineHeight', value as Preferences['lineHeight'])} options={[
                { value: 'standard', label: t('标准', 'Standard') }, { value: 'relaxed', label: t('宽松', 'Relaxed') },
              ]} />
            </FormField>
            <FormField className="preference-field switch-field" id="show-toc" label={t('显示本文目录', 'Show document outline')} hint={draft.hints ? t('按真实标题层级显示章节入口。', 'Navigate through the actual document headings.') : undefined}>
              <Switch id="show-toc" checked={draft.showToc} onCheckedChange={value => change('showToc', value)} />
            </FormField>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="preference-field checkbox-field"><Checkbox checked={draft.notifications} onChange={event => change('notifications', event.target.checked)}>
              {t('显示操作完成提示', 'Show action notifications')}
            </Checkbox>
              {draft.hints && <p className="field-help">{t('用于本地保存和资源操作，不会发送邮件或推送通知。', 'For local saves and resource actions. No emails or push notifications are sent.')}</p>}
            </div>
          </TabsContent>
          {error && <div className="settings-feedback"><InlineAlert tone="danger">{error}</InlineAlert></div>}
          <div className="settings-footer">
            <span className={`dirty-indicator ${dirty ? 'is-dirty' : ''}`} aria-live="polite">{dirty ? t('有未保存的更改', 'Unsaved changes') : t('所有更改已保存', 'All changes saved')}</span>
            <Button variant="secondary" onClick={() => { setDraft({ ...defaultPreferences }); setError(undefined); }}>{t('恢复默认', 'Restore defaults')}</Button>
            <Button type="submit" disabled={!dirty}>{t('保存更改', 'Save changes')}</Button>
          </div>
        </form>
        <aside className="settings-help"><SlidersHorizontal size={22} aria-hidden="true" />
          <p>{t('这些偏好只影响当前浏览器。选择跟随系统后，外观会随设备自动切换。', 'These preferences apply to this browser. System appearance follows your device automatically.')}</p>
          <div><Info size={15} aria-hidden="true" /><p>{t('调整完成后，保存更改即可。', 'Save your changes when you are ready.')}</p></div>
        </aside>
      </div>
    </Tabs>
  </section>;
}
