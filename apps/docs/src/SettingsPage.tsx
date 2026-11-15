import { useEffect, useState, type FormEvent } from 'react';
import { Button, Checkbox, FormField, InlineAlert, RadioGroup, Switch, Tabs, TabsContent, TabsList } from '@radish-ui/react';
import { Check, SlidersHorizontal } from 'lucide-react';
import { defaultPreferences, type Preferences, type Translate } from './model';
import { PageHeader } from './PageHeader';

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
    <PageHeader title={t('外观与偏好', 'Appearance & preferences')} />
    <Tabs value={tab} onValueChange={setTab} className="settings-tabs">
      <TabsList label={t('偏好分组', 'Preference sections')} size="md" items={[
        { value: 'appearance', label: t('外观', 'Appearance') }, { value: 'reading', label: t('阅读', 'Reading') }, { value: 'notifications', label: t('通知', 'Notifications') },
      ]} />
      <div className="settings-layout">
        <form className="settings-form" onSubmit={submit}>
          <TabsContent value="appearance">
            <div className="theme-fieldset" role="radiogroup" aria-labelledby="interface-theme">
              <span className="theme-heading" id="interface-theme">{t('界面主题', 'Interface theme')}</span>
              <div className="theme-options">
                {(['light', 'dark', 'system'] as const).map(theme => <label key={theme} className={`theme-option ${draft.theme === theme ? 'is-selected' : ''}`}>
                  <input type="radio" name="theme" value={theme} checked={draft.theme === theme} onChange={() => change('theme', theme)} />
                  <span className="theme-preview" data-rd-theme={theme === 'system' ? undefined : theme} aria-hidden="true">
                    <span className="theme-preview-rail"><b /><i className="is-active" /><i /><i /></span>
                    <span className="theme-preview-main"><span className="theme-preview-bar is-title" /><span className="theme-preview-bar" /><span className="theme-preview-bar is-short" /><span className="theme-preview-button" /></span>
                  </span>
                  <span className="theme-option-caption">{{ light: t('浅色', 'Light'), dark: t('深色', 'Dark'), system: t('跟随系统', 'System') }[theme]}{draft.theme === theme && <Check size={16} aria-hidden="true" />}</span>
                </label>)}
              </div>
            </div>
            <FormField className="preference-field" id="interface-language" label={t('界面语言', 'Interface language')}>
              <RadioGroup orientation="horizontal" value={draft.locale} onValueChange={value => change('locale', value as Preferences['locale'])} options={[{ value: 'zh-CN', label: '简体中文' }, { value: 'en', label: 'English' }]} />
            </FormField>
            <FormField className="preference-field" id="display-density" label={t('显示密度', 'Display density')}>
              <RadioGroup orientation="horizontal" value={draft.density} onValueChange={value => change('density', value as Preferences['density'])} options={[
                { value: 'compact', label: t('紧凑', 'Compact') }, { value: 'standard', label: t('标准', 'Standard') }, { value: 'spacious', label: t('宽松', 'Spacious') },
              ]} />
            </FormField>
            <FormField className="preference-field" id="reading-font-size" label={t('正文字号', 'Reading font size')} hint={t('仅调整文档正文，界面控件不变。', 'Changes document text only; interface controls stay the same.')}>
              <RadioGroup orientation="horizontal" value={draft.fontSize} onValueChange={value => change('fontSize', value as Preferences['fontSize'])} options={[
                { value: 'small', label: t('小 · 15 px', 'Small · 15 px') }, { value: 'standard', label: t('标准 · 16 px', 'Standard · 16 px') }, { value: 'large', label: t('大 · 18 px', 'Large · 18 px') },
              ]} />
            </FormField>
          </TabsContent>
          <TabsContent value="reading">
            <FormField className="preference-field" id="paragraph-spacing" label={t('段落行距', 'Paragraph line height')}>
              <RadioGroup orientation="horizontal" value={draft.lineHeight} onValueChange={value => change('lineHeight', value as Preferences['lineHeight'])} options={[
                { value: 'standard', label: t('标准', 'Standard') }, { value: 'relaxed', label: t('宽松', 'Relaxed') },
              ]} />
            </FormField>
            <FormField className="preference-field switch-field" id="show-toc" label={t('显示本文目录', 'Show document outline')}>
              <Switch id="show-toc" checked={draft.showToc} onCheckedChange={value => change('showToc', value)} />
            </FormField>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="preference-field checkbox-field"><Checkbox checked={draft.notifications} onChange={event => change('notifications', event.target.checked)}>
              {t('显示操作完成提示', 'Show action notifications')}
            </Checkbox>
              <p className="field-help">{t('用于本地保存和资源操作，不会发送邮件或推送通知。', 'For local saves and resource actions. No emails or push notifications are sent.')}</p>
            </div>
          </TabsContent>
          {error && <div className="settings-feedback"><InlineAlert tone="danger">{error}</InlineAlert></div>}
          <div className="settings-footer">
            <span className={`dirty-indicator ${dirty ? 'is-dirty' : ''}`} aria-live="polite">{dirty ? t('有未保存的更改', 'Unsaved changes') : t('所有更改已保存', 'All changes saved')}</span>
            <Button variant="secondary" onClick={() => { setDraft({ ...defaultPreferences }); setError(undefined); }}>{t('恢复默认', 'Restore defaults')}</Button>
            <Button type="submit" disabled={!dirty}>{t('保存更改', 'Save changes')}</Button>
          </div>
        </form>
        <aside className="settings-help"><SlidersHorizontal size={20} aria-hidden="true" />
          <p>{t('这些偏好只保存在当前浏览器。', 'These preferences are saved in this browser only.')}</p>
        </aside>
      </div>
    </Tabs>
  </section>;
}
