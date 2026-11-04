export type Stored<T> = { value: T | undefined; error?: string };

export function readStored<T>(key: string, validate: (value: unknown) => value is T): Stored<T> {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: undefined };
    const envelope: unknown = JSON.parse(raw);
    if (!envelope || typeof envelope !== 'object' || !('version' in envelope) || envelope.version !== 1
      || !('data' in envelope) || !validate(envelope.data)) {
      return { value: undefined, error: '本地数据格式不受支持 / Unsupported local data format' };
    }
    return { value: envelope.data };
  } catch (error) {
    return { value: undefined, error: error instanceof DOMException ? `浏览器存储不可用 / Storage unavailable (${error.name})` : '本地数据无法解析 / Local data could not be read' };
  }
}

export function writeStored<T>(key: string, data: T): string | undefined {
  try { window.localStorage.setItem(key, JSON.stringify({ version: 1, data })); return undefined; }
  catch (error) {
    return error instanceof DOMException ? `保存失败，浏览器存储不可用 / Save failed (${error.name})` : '无法保存到当前浏览器 / Could not save in this browser';
  }
}

export const storageKeys = {
  preferences: 'radishui.preferences.v1', resources: 'radishui.resources.v1', articles: 'radishui.articles.v1',
} as const;
