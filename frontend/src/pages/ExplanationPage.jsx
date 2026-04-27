import { useNavigate } from "react-router-dom";
import { analysisResult, alternatives } from "../data/dummyData";

export default function ExplanationPage() {
  const navigate = useNavigate();
  const data = analysisResult;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">● Optimal Choice Confirmed</span>
        </div>
        <h2 className="text-3xl font-bold text-stone-800">Why this decision?</h2>
        <p className="text-sm text-stone-500 mt-1">
          Our AI analyzed over 40 environmental impact vectors including carbon footprint, material degradation,
          and localized supply chain availability to determine the most sustainable path.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Left - Recommended Option */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">RECOMMENDED</span>
                <span className="text-sm text-green-600 font-semibold">-84% Carbon Impact</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-2">Direct Reuse</h3>
            <p className="text-sm text-stone-500 mb-4">
              The item maintains 93% structural integrity. Direct redistribution to the local secondary
              market requires zero energy for processing or transport outside of a 15km radius.
            </p>

            <div className="flex flex-col gap-2 mb-4">
              {[
                "Immediate availability for re-entry",
                "Preserves high-value aesthetic appeal",
                "Zero chemical stripping required",
              ].map((pro) => (
                <div key={pro} className="flex items-center gap-2 text-sm text-stone-600">
                  <span className="text-green-500">✓</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/alternatives")}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              Execute Path →
            </button>
          </div>

          {/* Recycle Option */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm opacity-70">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">LAST RESORT</span>
              <span className="text-xs text-red-500 font-medium">⚠ High energy cost</span>
            </div>
            <h4 className="text-lg font-bold text-stone-700 mb-2">Recycle</h4>
            <p className="text-sm text-stone-400">
              Materials can be broken down into wood pulp and steel scrap. 45% mass loss during downcycling process.
            </p>
          </div>
        </div>

        {/* Right - Material Breakdown + Image */}
        <div className="flex flex-col gap-4">

          {/* Material Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Material Breakdown</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Plywood Shell", value: 65, color: "bg-stone-600" },
                { label: "Steel Frame", value: 35, color: "bg-stone-400" },
                { label: "Foam & Textile", value: 10, color: "bg-stone-300" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{m.label}</span>
                    <span className="text-stone-400 font-medium">{m.value}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className={`${m.color} h-2 rounded-full`} style={{ width: `${m.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-600 rounded-2xl p-5 text-white">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Carbon Saved</p>
              <p className="text-3xl font-bold">{data.carbonSaved}</p>
              <p className="text-xs opacity-70 mt-1">vs market average</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Material Source</p>
              <p className="text-lg font-bold text-stone-800">{data.materialSource}</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Eco Index</p>
              <p className="text-3xl font-bold text-green-600">{data.ecoIndex}</p>
            </div>
            <div className="bg-stone-800 rounded-2xl p-5 text-white">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Lifetime CO2</p>
              <p className="text-3xl font-bold">{data.savedLifetimeCO2}</p>
              <p className="text-xs opacity-70 mt-1">saved total</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/decision")}
            className="w-full border border-stone-200 text-stone-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            ← Back to Decision
          </button>
        </div>
      </div>
    </div>
  );
}