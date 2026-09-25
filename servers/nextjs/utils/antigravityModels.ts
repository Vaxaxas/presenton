export interface AntigravityModel {
  id: string;
  name: string;
}

export const ANTIGRAVITY_MODELS: AntigravityModel[] = [
  { id: "gemini-3-pro-high", name: "Gemini 3 Pro High (Default)" },
  { id: "gemini-3-pro-low", name: "Gemini 3 Pro Low" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6 (Thinking)" },
  { id: "claude-opus-4-6-thinking", name: "Claude Opus 4.6 Thinking" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
];

export const DEFAULT_ANTIGRAVITY_MODEL = "gemini-3-pro-high";

const ANTIGRAVITY_MODEL_IDS = new Set(ANTIGRAVITY_MODELS.map((model) => model.id));

export function isSupportedAntigravityModel(model?: string): boolean {
  return Boolean(model && ANTIGRAVITY_MODEL_IDS.has(model));
}
