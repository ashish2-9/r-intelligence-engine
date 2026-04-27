// =============================================================================
// src/pages/AnalyzePage.jsx
//
// Complete analysis form — wired to real FastAPI backend.
// Auto-populates location from /api/v1/location (ip-api.com, free).
// Sends real POST to /api/v1/analyse and navigates to /decision on success.
// =============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Scan, MapPin, AlertCircle, RefreshCw } from 'lucide-react'
import { analyseItem } from '../api/client'
import { useApp } from '../context/AppContext'
import FormCard from '../components/FormCard'

// ── Material options mapped to backend MaterialType enum ──────────────────
const MATERIALS = [
  { value: 'pet_plastic',   label: '🧴 PET Plastic',           group: 'Plastic' },
  { value: 'hdpe_plastic',  label: '🪣 HDPE Plastic',          group: 'Plastic' },
  { value: 'mixed_plastic', label: '♻️ Mixed/Film Plastic',     group: 'Plastic' },
  { value: 'glass',         label: '🫙 Glass',                  group: 'Glass'   },
  { value: 'aluminium',     label: '🥤 Aluminium',             group: 'Metal'   },
  { value: 'steel',         label: '🔩 Steel / Tin',           group: 'Metal'   },
  { value: 'electronic',    label: '📱 Electronic / E-waste',  group: 'Tech'    },
  { value: 'textile',       label: '👕 Textile / Clothing',    group: 'Fabric'  },
  { value: 'organic',       label: '🍃 Organic / Food waste',  group: 'Organic' },
  { value: 'paper',         label: '📦 Paper / Cardboard',     group: 'Paper'   },
]

// ── Condition options mapped to backend ConditionType enum ────────────────
const CONDITIONS = [
  { value: 'new',          label: 'New — Unused',                dot: 'bg-green-500'  },
  { value: 'good',         label: 'Good — Minor wear',           dot: 'bg-green-400'  },
  { value: 'used',         label: 'Used — Functional',           dot: 'bg-yellow-400' },
  { value: 'damaged',      label: 'Damaged — Repairable',        dot: 'bg-orange-400' },
  { value: 'broken',       label: 'Broken — Non-functional',     dot: 'bg-red-400'    },
  { value: 'contaminated', label: 'Contaminated — Hazardous',   dot: 'bg-red-600'    },
  { value: 'end_of_life',  label: 'End of Life — Exhausted',    dot: 'bg-stone-400'  },
]

// ── Quick presets for demo ────────────────────────────────────────────────
const PRESETS = [
  { label: '📱 Broken Phone',    material: 'electronic', condition: 'damaged',  desc: 'Smartphone with cracked screen', repair: true,  recycle: true  },
  { label: '🧴 Plastic Bottle',  material: 'pet_plastic', condition: 'used',    desc: 'PET water bottle, 500ml',       repair: false, recycle: true  },
  { label: '🫙 Glass Jar',       material: 'glass',       condition: 'good',    desc: 'Large glass food jar',          repair: false, recycle: true  },
  { label: '🍎 Food Scraps',     material: 'organic',     condition: 'end_of_life', desc: 'Vegetable peels and scraps', repair: false, recycle: false },
  { label: '👕 Old T-Shirt',     material: 'textile',     condition: 'used',    desc: 'Faded cotton t-shirt',          repair: true,  recycle: false },
  { label: '💻 Old Laptop',      material: 'electronic', condition: 'broken',   desc: 'Laptop with motherboard failure',repair:true,  recycle: true  },
]

const USER_ID = 'user_' + (typeof window !== 'undefined'
  ? (localStorage.getItem('r_user_id') || (() => {
      const id = Math.random().toString(36).slice(2)
      localStorage.setItem('r_user_id', id)
      return id
    })())
  : 'demo')

export default function AnalyzePage() {
  const navigate = useNavigate()
  const { userLocation, setAnalysisResult, setAnalysisRequest, apiConnected } = useApp()

  const [form, setForm] = useState({
    material: '', condition: '', description: '', has_repair_shop: false,
    has_recycling_facility: false, is_industrial_context: false,
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingSteps = [
    'Running Indian NLP translation layer...',
    'Querying Overpass geospatial API...',
    'Running feasibility filter...',
    'Calculating multi-criteria scores...',
    'Applying hierarchy override check...',
    'Building explanation & alternatives...',
  ]

  function applyPreset(p) {
    setForm({ material: p.material, condition: p.condition, description: p.desc,
              has_repair_shop: p.repair, has_recycling_facility: p.recycle,
              is_industrial_context: false })
    setError(null)
  }

  async function handleSubmit() {
    if (!form.material || !form.condition) {
      setError('Please select a material type and condition.')
      return
    }
    setError(null)
    setLoading(true)
    setLoadingStep(0)

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, loadingSteps.length - 1))
    }, 500)

    try {
      const payload = {
        user_id:                USER_ID,
        material:               form.material,
        condition:              form.condition,
        description:            form.description || null,
        has_recycling_facility: form.has_recycling_facility,
        has_repair_shop:        form.has_repair_shop,
        is_industrial_context:  form.is_industrial_context,
        location_code:          userLocation?.country_code || 'IN',
        // Pass real coordinates from ip-api.com geolocation
        lat:                    userLocation?.lat || null,
        lon:                    userLocation?.lon || null,
      }

      setAnalysisRequest(payload)
      const result = await analyseItem(payload)
      setAnalysisResult(result)
      navigate('/decision')
    } catch (err) {
      setError(err.message || 'Analysis failed. Check the API connection.')
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
      setLoadingStep(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Analyze Item</h2>
        <p className="text-sm text-stone-500 mt-1">
          AI-driven circular economy decision for your item. Powered by EU Waste Hierarchy.
        </p>
        {userLocation && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
            <MapPin size={12} />
            <span>Location detected: {userLocation.city}, {userLocation.region}, {userLocation.country} — Overpass facility search active</span>
          </div>
        )}
      </div>

      {/* API offline warning */}
      {apiConnected === false && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <strong>API not connected.</strong> Run <code className="bg-red-100 px-1 rounded">docker compose up --build</code> in the project root.
          </div>
        </div>
      )}

      {/* Quick presets */}
      <FormCard>
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={14} className="text-green-600" />
          <span className="text-sm font-semibold text-stone-700">Quick Scenarios</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)}
              className="text-left text-xs px-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50
                         hover:bg-green-50 hover:border-green-300 hover:text-green-700
                         transition-all text-stone-600 font-medium">
              {p.label}
            </button>
          ))}
        </div>
      </FormCard>

      <div className="mt-4" />

      {/* Main form */}
      <FormCard>
        <div className="flex items-center gap-2 mb-6">
          <Scan size={14} className="text-green-600" />
          <span className="font-semibold text-stone-700">Item Details</span>
        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* Material */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Material Type *</label>
            <select value={form.material} onChange={e => setForm(p => ({...p, material: e.target.value}))}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200">
              <option value="">Select material...</option>
              {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Condition */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Condition *</label>
            <select value={form.condition} onChange={e => setForm(p => ({...p, condition: e.target.value}))}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200">
              <option value="">Select condition...</option>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Description / Indian slang */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              Description <span className="text-stone-400 normal-case font-normal">(or Indian local terms: raddi, kabad, bhangar...)</span>
            </label>
            <input type="text" value={form.description}
              onChange={e => setForm(p => ({...p, description: e.target.value}))}
              placeholder="e.g. cracked smartphone, plastic panni, purani botal..."
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200" />
            <p className="text-xs text-stone-400">Supports Hindi/Indian slang — HuggingFace NLP maps local terms to material categories</p>
          </div>

        </div>

        {/* Context toggles */}
        <div className="mt-5">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-3">Local Infrastructure</label>
          <div className="flex flex-col gap-2">
            {[
              { key: 'has_repair_shop',        label: 'Repair shop nearby',          desc: 'Certified repair café or service within 5km' },
              { key: 'has_recycling_facility',  label: 'Recycling facility nearby',   desc: 'Kerbside or drop-off point accessible' },
              { key: 'is_industrial_context',   label: 'Industrial / commercial use', desc: 'Item from factory, office, or commercial setting' },
            ].map(({ key, label, desc }) => (
              <label key={key} className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all
                ${form[key] ? 'bg-green-50 border-green-300' : 'bg-stone-50 border-stone-200 hover:border-stone-300'}`}>
                <div>
                  <p className={`text-sm font-medium ${form[key] ? 'text-green-700' : 'text-stone-700'}`}>{label}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                </div>
                <div className={`relative w-11 h-6 rounded-full border transition-all duration-200
                  ${form[key] ? 'bg-green-500 border-green-500' : 'bg-stone-200 border-stone-300'}`}
                  onClick={() => setForm(p => ({...p, [key]: !p[key]}))}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200
                    ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading steps */}
        {loading && (
          <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
            <div className="flex flex-col gap-2">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs transition-colors duration-300
                  ${i < loadingStep ? 'text-green-600 font-medium' : i === loadingStep ? 'text-green-700 font-semibold' : 'text-stone-400'}`}>
                  {i < loadingStep ? '✓' : i === loadingStep ? '⟳' : '○'}
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            🔒 <strong className="text-stone-500">Privacy Guaranteed</strong> · Data logged locally
          </p>
          <button onClick={handleSubmit} disabled={loading || !form.material || !form.condition}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                       text-white text-sm font-semibold px-6 py-2.5 rounded-lg
                       flex items-center gap-2 transition-colors">
            {loading ? (
              <><Loader2 size={15} className="animate-spin" />Analysing...</>
            ) : (
              <><Scan size={15} />Generate Strategy</>
            )}
          </button>
        </div>
      </FormCard>
    </div>
  )
}
