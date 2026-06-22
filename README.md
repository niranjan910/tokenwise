# TokenWise

A fast, no-backend **token & cost calculator** for LLM prompts. Paste your text and
instantly see how many tokens it uses — and what it costs — across OpenAI, Anthropic,
Google and Meta models.

![TokenWise](src/assets/hero.png)

## Why

Different providers tokenize text differently, and pricing varies by an order of
magnitude. TokenWise lets you compare a single prompt across models side by side
before you spend anything.

## How counts work

- **OpenAI models** use the real tiktoken BPE tables shipped by
  [`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer) — these counts are
  **exact**.
- **Claude, Gemini and Llama** have no official public JavaScript tokenizer for their
  current models, so their counts are **estimated** from the GPT-4o count using a
  per-model factor. Estimates are always labelled `≈ est` in the UI — we never fake
  precision.

## Keeping it current

Models and prices move fast. Everything lives in one file:
[`src/data/models.ts`](src/data/models.ts). Edit the `MODELS` array, verify each price
against the provider's official pricing page, and bump `PRICES_LAST_UPDATED`.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # eslint
```

Built with React 19, TypeScript, Vite and Tailwind CSS v4.

## License

MIT
