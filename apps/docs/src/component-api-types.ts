/** A generated API row: every field is required so the site renders a complete table. */
export interface ComponentApiRow {
  component?: string;
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export const behaviorTopics = ['keyboard', 'focus', 'aria', 'limitation'] as const;
export type BehaviorTopic = (typeof behaviorTopics)[number];

export const behaviorSources = ['native', 'radix', 'radish'] as const;
export type BehaviorSource = (typeof behaviorSources)[number];

export const behaviorTopicLabels: Record<BehaviorTopic, string> = {
  keyboard: '键盘',
  focus: '焦点',
  aria: 'ARIA',
  limitation: '已知限制',
};

export const behaviorSourceLabels: Record<BehaviorSource, string> = {
  native: '浏览器原生',
  radix: 'Radix',
  radish: 'RadishUI',
};

/** One behavior / focus / ARIA / limitation fact and the layer that provides it. */
export interface BehaviorEntry {
  topic: BehaviorTopic;
  source: BehaviorSource;
  text: string;
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
