// src/pages/DecisionPage.jsx — Real API result display
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ChevronRight, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react'

const STRATEGY_META = {
  reduce:  { color: 'text-purple-700 bg-purple-50 border-purple-200',  bar: 'bg-purple-500',  emoji: '📉', label: 'Reduce'  },
  reuse:   { color: 'text-green-700 bg-green-50 border-green-200',     bar: 'bg-green-500',   emoji: '♻️', label: 'Reuse'   },
  repair:  { color: 'text-amber-700 bg-amber-50 border-amber-200',     bar: 'bg-amber-500',   emoji: '🔧', label: 'Repair'  },
  recycle: { color: 'text-blue-700 bg-blue-50 border-blue-200',        bar: 'bg-blue-500',    emoji: '🔄', label: 'Recycle' },
  recover: { color: 'text-red-700 bg-red-50 border-red-200',           bar: 'bg-red-400',     emoji: '⚡', label: 'Recover' },
}

export default function DecisionPage() {
  const navigate = useNavigate()
  const { analysisResult, analysisRequest, clearResult } = useApp()

  // If no real result, show prompt to go analyse
  if (!analysisResult) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">No analysis yet</h2>
        <p className="text-stone-500 mb-6">Run an item analysis to see your circular economy recommendation here.</p>
        <button onClick={() => navigate('/analyze')} className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700">
          → Analyze an Item
        </button>
      </div>
    )
  }

  const { primary_strategy, confidence_pct, override_applied, override_reason,
          scores, alternatives, co2_saved_kg, energy_saving_pct, lifecycle_multiplier,
          explanation, action_guidance, behavioral_nudge } = analysisResult

  const meta    = STRATEGY_META[primary_strategy] || STRATEGY_META['reuse']
  const ecoScore = Math.round(confidence_pct)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Decision Result</h2>
        <p className="text-sm text-stone-500 mt-1">AI-powered circular economy recommendation based on real feasibility scoring.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* LEFT — Primary recommendation */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">AI Recommendation</span>
          </div>

          <div>
            <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${meta.color} mb-3`}>
              {meta.emoji} {primary_strategy.toUpperCase()}
            </span>
            <h3 className="text-3xl font-bold text-stone-800 leading-tight capitalize">{primary_strategy}</h3>
            <p className="text-sm text-stone-400 mt-1">
              {analysisRequest ? `${analysisRequest.material?.replace('_',' ')} · ${analysisRequest.condition}` : ''}
            </p>
          </div>

          {/* Eco Score Ring */}
          <div className="flex justify-center py-2">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e7e5e4" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="10"
                  strokeDasharray={`${ecoScore * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-stone-800">{ecoScore}</span>
                <span className="text-xs text-stone-400 uppercase tracking-wide">Confidence</span>
              </div>
            </div>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'CO₂ Saved',      value: `${co2_saved_kg}kg` },
              { label: 'Energy Saving',  value: `${energy_saving_pct}%` },
              { label: 'Lifecycle ×',    value: `${lifecycle_multiplier}×` },
              { label: 'Priority',       value: ['reduce','reuse','repair','recycle','recover'].indexOf(primary_strategy) + 1 + '/5' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-400">{label}</p>
                <p className="text-lg font-bold text-stone-800">{value}</p>
              </div>
            ))}
          </div>

          {override_applied && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <div><strong>Hierarchy override:</strong> {override_reason}</div>
            </div>
          )}

          <button onClick={() => navigate('/alternatives')}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg">
            View All Options →
          </button>
        </div>

        {/* MIDDLE — Score breakdown + explanation */}
        <div className="flex flex-col gap-4">

          <div className="bg-green-600 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2">🤖 AI Explanation</p>
            <p className="text-sm leading-relaxed">{explanation}</p>
            <p className="text-xs opacity-70 mt-2 italic">{action_guidance}</p>
            <button onClick={() => navigate('/explanation')}
              className="mt-4 bg-white text-green-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-50">
              Full Reasoning →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex-1">
            <h4 className="font-semibold text-stone-700 mb-4">Score Breakdown</h4>
            <div className="flex flex-col gap-4">
              {scores.map(score => {
                const sm = STRATEGY_META[score.strategy] || STRATEGY_META['reuse']
                const isWinner = score.strategy === primary_strategy
                return (
                  <div key={score.strategy} className={`${isWinner ? 'ring-1 ring-green-300 bg-green-50 rounded-lg p-2 -mx-2' : ''}`}>
                    <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${sm.bar}`}></span>
                        <span className={`capitalize font-medium ${isWinner ? 'text-green-700' : ''}`}>
                          {score.strategy} {isWinner ? '★' : ''}
                        </span>
                      </span>
                      <span className="font-mono font-bold">{(score.total).toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className={`${sm.bar} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${score.total * 10}%` }} />
                    </div>
                    <div className="grid grid-cols-4 gap-1 mt-1">
                      {[
                        { label: 'Env', val: score.env },
                        { label: 'Cost', val: score.cost },
                        { label: 'Life', val: score.lifecycle },
                        { label: 'Effort', val: score.effort },
                      ].map(({ label, val }) => (
                        <div key={label} className="text-center">
                          <p className="text-[10px] text-stone-400">{label}</p>
                          <p className="text-xs font-bold text-stone-700">{val.toFixed(1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Alternatives + behavioral nudge */}
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h4 className="font-semibold text-stone-700 mb-3">Alternative Strategies</h4>
            <div className="flex flex-col gap-2">
              {alternatives.map(alt => {
                const am = STRATEGY_META[alt.strategy] || STRATEGY_META['recycle']
                return (
                  <div key={alt.strategy} className={`p-3 rounded-xl border ${am.color} flex items-center justify-between`}>
                    <div>
                      <p className="text-sm font-semibold capitalize">{alt.strategy}</p>
                      <p className="text-xs opacity-70">Score: {alt.total_score?.toFixed(1)}/10</p>
                    </div>
                    <ChevronRight size={14} className="opacity-50" />
                  </div>
                )
              })}
            </div>
          </div>

          {behavioral_nudge && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">💡 Behavioral Insight</p>
              <p className="text-sm text-amber-800 leading-relaxed">{behavioral_nudge}</p>
            </div>
          )}

          <div className="bg-stone-800 rounded-2xl p-5 text-white">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">Feasibility Gates Passed</p>
            {scores.map(s => (
              <div key={s.strategy} className="flex items-center gap-2 text-xs py-1">
                <span className="text-green-400">✓</span>
                <span className="capitalize text-stone-300">{s.strategy}</span>
                <span className="text-stone-500 ml-auto font-mono">{(s.total).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <button onClick={clearResult} className="w-full border border-stone-200 text-stone-500 text-sm py-2.5 rounded-lg hover:bg-stone-50 flex items-center justify-center gap-2">
            <RotateCcw size={13} /> New Analysis
          </button>
        </div>

      </div>
    </div>
  )
}
