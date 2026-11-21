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
