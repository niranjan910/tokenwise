// ─────────────────────────────────────────────────────────────────────────────
//  MODEL & PRICING CONFIG  —  this is the only file you need to edit to keep
//  TokenWise up to date. Prices are USD per 1,000,000 tokens.
//
//  ⚠️  PRICES CHANGE OFTEN.  Verify every number against the provider's official
//      pricing page before relying on it, and bump PRICES_LAST_UPDATED.
//        • OpenAI     https://openai.com/api/pricing/
//        • Anthropic  https://www.anthropic.com/pricing
//        • Google     https://ai.google.dev/pricing
//        • Meta/Llama priced by whichever host you use (Together, Groq, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const PRICES_LAST_UPDATED = '2026-01-01'

/** Which tokenizer to use for the count. */
export type Encoding =
  | 'o200k_base' // GPT-4o / o-series — exact (tiktoken)
  | 'cl100k_base' // GPT-4 / GPT-3.5 — exact (tiktoken)
  | 'estimate' // no public JS tokenizer — approximated, clearly labelled

export interface Model {
  id: string
  name: string
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta'
  encoding: Encoding
  /** Only used when encoding === 'estimate': tokens ≈ gpt-4o tokens × factor. */
  estimateFactor?: number
  /** USD per 1M input tokens. */
  inputPerM: number
  /** USD per 1M output tokens. */
  outputPerM: number
}

// NOTE: model line-ups move fast. Review this list before launch and add/remove
// whatever is current — the UI renders straight from this array.
export const MODELS: Model[] = [
  // ── OpenAI ── exact counts via tiktoken ───────────────────────────────────
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', encoding: 'o200k_base', inputPerM: 2.5, outputPerM: 10 },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI', encoding: 'o200k_base', inputPerM: 0.15, outputPerM: 0.6 },
  { id: 'o1', name: 'o1', provider: 'OpenAI', encoding: 'o200k_base', inputPerM: 15, outputPerM: 60 },
  { id: 'o3-mini', name: 'o3-mini', provider: 'OpenAI', encoding: 'o200k_base', inputPerM: 1.1, outputPerM: 4.4 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', encoding: 'cl100k_base', inputPerM: 0.5, outputPerM: 1.5 },

  // ── Anthropic ── estimated (no official public JS tokenizer) ──────────────
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', encoding: 'estimate', estimateFactor: 1.15, inputPerM: 3, outputPerM: 15 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', encoding: 'estimate', estimateFactor: 1.15, inputPerM: 15, outputPerM: 75 },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', encoding: 'estimate', estimateFactor: 1.15, inputPerM: 0.8, outputPerM: 4 },

  // ── Google ── estimated ───────────────────────────────────────────────────
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', encoding: 'estimate', estimateFactor: 1.05, inputPerM: 1.25, outputPerM: 5 },
  { id: 'gemini-1-5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', encoding: 'estimate', estimateFactor: 1.05, inputPerM: 0.075, outputPerM: 0.3 },

  // ── Meta ── estimated; price depends on your host (example: Together AI) ───
  { id: 'llama-3-1-70b', name: 'Llama 3.1 70B', provider: 'Meta', encoding: 'estimate', estimateFactor: 1.1, inputPerM: 0.88, outputPerM: 0.88 },
  { id: 'llama-3-1-8b', name: 'Llama 3.1 8B', provider: 'Meta', encoding: 'estimate', estimateFactor: 1.1, inputPerM: 0.18, outputPerM: 0.18 },
]

export const PROVIDER_COLORS: Record<Model['provider'], string> = {
  OpenAI: '#10a37f',
  Anthropic: '#d97757',
  Google: '#4285f4',
  Meta: '#0866ff',
}
