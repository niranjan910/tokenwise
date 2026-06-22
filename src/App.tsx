import { useMemo, useState } from 'react'
import {
  MODELS,
  PROVIDER_COLORS,
  PRICES_LAST_UPDATED,
  type Model,
} from './data/models'
import {
  baseCounts,
  tokensForModel,
  cost,
  formatUSD,
  formatNum,
} from './lib/tokenizer'

const SAMPLE = `TokenWise estimates how many tokens your prompt uses — and what it costs — across every major model.

Paste a real prompt here. OpenAI counts are exact (tiktoken); Claude, Gemini and Llama are estimated and clearly labelled as such.`

type Row = {
  model: Model
  tokens: number
  inputCost: number
  outputCost: number
  total: number
}

function App() {
  const [text, setText] = useState(SAMPLE)
  const [outputTokens, setOutputTokens] = useState(0)

  const base = useMemo(() => baseCounts(text), [text])

  const rows = useMemo<Row[]>(() => {
    return MODELS.map((model) => {
      const tokens = tokensForModel(text, model, base)
      const inputCost = cost(tokens, model.inputPerM)
      const outputCost = cost(outputTokens, model.outputPerM)
      return { model, tokens, inputCost, outputCost, total: inputCost + outputCost }
    })
  }, [text, base, outputTokens])

  const cheapest = rows.reduce(
    (min, r) => (r.total < min ? r.total : min),
    rows[0]?.total ?? 0,
  )

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg font-black text-white shadow-lg shadow-indigo-500/20"
          >
            T
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              TokenWise
            </h1>
            <p className="text-sm text-zinc-400">
              Token & cost calculator across LLM providers
            </p>
          </div>
        </div>
      </header>

      {/* Input card */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 backdrop-blur">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder="Paste or type your prompt here…"
          className="h-52 w-full resize-y rounded-t-2xl bg-transparent p-5 font-mono text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600"
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-3">
          <Stat label="Characters" value={formatNum(base.characters)} />
          <Divider />
          <Stat label="Words" value={formatNum(base.words)} />
          <Divider />
          <Stat label="GPT-4o tokens" value={formatNum(base.baseTokens)} />

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              Expected output tokens
              <input
                type="number"
                min={0}
                value={outputTokens}
                onChange={(e) =>
                  setOutputTokens(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-24 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-right text-sm text-zinc-100 outline-none focus:border-indigo-400/60"
              />
            </label>
            <button
              type="button"
              onClick={() => setText('')}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/5"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Results table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-3 font-medium">Model</th>
              <th className="px-5 py-3 text-right font-medium">Tokens</th>
              <th className="px-5 py-3 text-right font-medium">Input</th>
              <th className="px-5 py-3 text-right font-medium">Output</th>
              <th className="px-5 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ model, tokens, inputCost, outputCost, total }) => {
              const estimated = model.encoding === 'estimate'
              const isCheapest = total === cheapest && rows.length > 1
              return (
                <tr
                  key={model.id}
                  className="border-t border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: PROVIDER_COLORS[model.provider] }}
                      />
                      <div>
                        <div className="font-medium text-zinc-100">
                          {model.name}
                          {isCheapest && (
                            <span className="ml-2 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                              cheapest
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {model.provider}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-zinc-100">
                    <span>{formatNum(tokens)}</span>
                    <span
                      className={
                        'ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ' +
                        (estimated
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-sky-500/15 text-sky-400')
                      }
                      title={
                        estimated
                          ? 'Estimated — no public JS tokenizer for this model'
                          : 'Exact count via tiktoken'
                      }
                    >
                      {estimated ? '≈ est' : 'exact'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-zinc-300">
                    {formatUSD(inputCost)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-zinc-300">
                    {formatUSD(outputCost)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">
                    {formatUSD(total)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span>
          Costs assume your text is the <em>input</em>. Set expected output
          tokens above to include generation cost.
        </span>
        <span className="ml-auto">Prices last updated {PRICES_LAST_UPDATED}</span>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold tabular-nums text-zinc-100">
        {value}
      </span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  )
}

function Divider() {
  return <span aria-hidden className="h-4 w-px bg-white/10" />
}

export default App
