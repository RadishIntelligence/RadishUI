/** A generated API row: every field is required so the site renders a complete table. */
export interface ComponentApiRow {
  component?: string;
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  /** 中文说明；组件页中文模式与 llms.txt 消费。 */
  description: string;
  /** 英文说明，与 `description` 同源维护；组件页英文模式消费。 */
  descriptionEn: string;
}

export const behaviorTopics = ['keyboard', 'focus', 'aria', 'limitation'] as const;
export type BehaviorTopic = (typeof behaviorTopics)[number];

export const behaviorSources = ['native', 'radix', 'radish'] as const;
export type BehaviorSource = (typeof behaviorSources)[number];

/** 行为主题的显示文案；组件页按语言取值，llms.txt 只消费中文。 */
export const behaviorTopicLabels: Record<BehaviorTopic, { zh: string; en: string }> = {
  keyboard: { zh: '键盘', en: 'Keyboard' },
  focus: { zh: '焦点', en: 'Focus' },
  aria: { zh: 'ARIA', en: 'ARIA' },
  limitation: { zh: '已知限制', en: 'Known limitations' },
};

/** 行为来源的显示文案；组件页按语言取值，llms.txt 只消费中文。 */
export const behaviorSourceLabels: Record<BehaviorSource, { zh: string; en: string }> = {
  native: { zh: '浏览器原生', en: 'Browser-native' },
  radix: { zh: 'Radix', en: 'Radix' },
  radish: { zh: 'RadishUI', en: 'RadishUI' },
};

/** One behavior / focus / ARIA / limitation fact and the layer that provides it. */
export interface BehaviorEntry {
  topic: BehaviorTopic;
  source: BehaviorSource;
  /** 中文声明；组件页中文模式与 llms.txt 消费。 */
  text: string;
  /** 英文声明，与 `text` 同源维护；组件页英文模式消费。 */
  textEn: string;
}

export interface PilotDoc {
  api: readonly ComponentApiRow[];
  behavior: readonly BehaviorEntry[];
  importCode: string;
  related: readonly string[];
}

/**
 * An authored API row. Only fields that `scripts/generate-api.mjs` cannot derive from
 * `packages/react/src` stay here: inherited native / Radix props (type, required,
 * description), union props (ToggleGroup / Accordion), `其余属性` rows, and default
 * values the component does not destructure.
 *
 * English descriptions live in `component-api-en.ts` keyed by component id and row, so
 * the generated API table can localize without duplicating prose in this contract.
 */
export interface AuthoredApiRow {
  component?: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  description?: string;
}

export interface AuthoredPilotDoc {
  api: readonly AuthoredApiRow[];
  importCode: string;
  related: readonly string[];
}
