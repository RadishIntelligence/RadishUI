/** A generated API row: every field is required so the site renders a complete table. */
export interface ComponentApiRow {
  component?: string;
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export interface PilotDoc {
  api: readonly ComponentApiRow[];
  importCode: string;
  keyboard: readonly string[];
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
  keyboard: readonly string[];
  related: readonly string[];
}
