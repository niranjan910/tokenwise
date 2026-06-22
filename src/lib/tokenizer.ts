// Token counting.
//
// OpenAI models use the real tiktoken BPE tables shipped by `gpt-tokenizer`,
// so those counts are EXACT. No other major provider publishes a JavaScript
// tokenizer for their current models, so Claude / Gemini / Llama are ESTIMATED
// from the GPT-4o count using a per-model factor (see src/data/models.ts).
// Estimates are always labelled as such in the UI — we never fake precision.

import { encode as encodeO200k } from 'gpt-tokenizer/encoding/o200k_base'
import { encode as encodeCl100k } from 'gpt-tokenizer/encoding/cl100k_base'
import type { Model } from '../data/models'

export interface Counts {
  characters: number
  words: number
  /** GPT-4o (o200k_base) token count — used as the basis for estimates. */
  baseTokens: number
}

/** Compute the cheap text stats plus the exact GPT-4o token count once. */
export function baseCounts(text: string): Counts {
  return {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    baseTokens: text ? encodeO200k(text).length : 0,
  }
}

/** Tokens for a specific model. Exact for OpenAI, estimated otherwise. */
export function tokensForModel(text: string, model: Model, base: Counts): number {
  if (!text) return 0
  switch (model.encoding) {
    case 'o200k_base':
      return base.baseTokens // already computed, reuse it
    case 'cl100k_base':
      return encodeCl100k(text).length
    case 'estimate':
      return Math.round(base.baseTokens * (model.estimateFactor ?? 1))
  }
}

/** Cost in USD for a given token count at a per-1M-tokens price. */
export function cost(tokens: number, perMillion: number): number {
  return (tokens / 1_000_000) * perMillion
}

/** Format a USD amount with sensible precision for tiny values. */
export function formatUSD(amount: number): string {
  if (amount === 0) return '$0'
  if (amount < 0.01) return '$' + amount.toFixed(5)
  if (amount < 1) return '$' + amount.toFixed(4)
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const formatNum = (n: number): string => n.toLocaleString('en-US')
