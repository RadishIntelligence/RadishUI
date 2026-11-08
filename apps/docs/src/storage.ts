import { isLegacyPreferences, isPreferences, migratePreferences, type Preferences } from './model';

export type Stored<T> = { value: T | undefined; error?: string };

export function readStored<T>(key: string, validate: (value: unknown) => value is T, version = 1): Stored<T> {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: undefined };
    const envelope: unknown = JSON.parse(raw);
    if (!envelope || typeof envelope !== 'object' || !('version' in envelope) || envelope.version !== version
      || !('data' in envelope) || !validate(envelope.data)) {
      return { value: undefined, error: '本地数据格式不受支持 / Unsupported local data format' };
    }
    return { value: envelope.data };
  } catch (error) {
    return { value: undefined, error: error instanceof DOMException ? `浏览器存储不可用 / Storage unavailable (${error.name})` : '本地数据无法解析 / Local data could not be read' };
  }
}

export function writeStored<T>(key: string, data: T, version = 1): string | undefined {
  try { window.localStorage.setItem(key, JSON.stringify({ version, data })); return undefined; }
  catch (error) {
    return error instanceof DOMException ? `保存失败，浏览器存储不可用 / Save failed (${error.name})` : '无法保存到当前浏览器 / Could not save in this browser';
  }
}

export const storageKeys = {
  preferences: 'radishui.preferences.v1', resources: 'radishui.resources.v1', articles: 'radishui.articles.v1',
} as const;

// Preferences use envelope version 2 after the density scale was renamed. Version 1
// values are migrated once, so an existing browser keeps its previous appearance.
export function readPreferences(): Stored<Preferences> {
  try {
    const raw = window.localStorage.getItem(storageKeys.preferences);
    if (raw === null) return { value: undefined };
    const envelope: unknown = JSON.parse(raw);
    if (!envelope || typeof envelope !== 'object' || !('version' in envelope) || !('data' in envelope)) {
      return { value: undefined, error: '本地数据格式不受支持 / Unsupported local data format' };
    }
    if (envelope.version === 2 && isPreferences(envelope.data)) return { value: envelope.data };
    if (envelope.version === 1) {
      if (isLegacyPreferences(envelope.data)) return { value: migratePreferences(envelope.data) };
      if (isPreferences(envelope.data)) return { value: envelope.data };
    }
    return { value: undefined, error: '本地数据格式不受支持 / Unsupported local data format' };
  } catch (error) {
    return { value: undefined, error: error instanceof DOMException ? `浏览器存储不可用 / Storage unavailable (${error.name})` : '本地数据无法解析 / Local data could not be read' };
  }
}
