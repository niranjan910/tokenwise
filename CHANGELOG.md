# Changelog

Incremental documentation notes for TokenWise.
- Clarify that OpenAI token counts are exact via the tiktoken BPE tables.
- Note that Claude, Gemini and Llama counts are estimated and labelled in the UI.
- Document the per-model estimateFactor used for non-OpenAI models.
- Record official pricing source links for each provider in models.ts.
- Remind editors to bump PRICES_LAST_UPDATED whenever prices change.
- Explain how the 'cheapest' badge is derived from total cost.
- Describe the expected-output-tokens input and its effect on cost.
- Document the o200k_base vs cl100k_base encodings used per model.
- Note the /tokenwise/ base path needed for GitHub Pages builds.
