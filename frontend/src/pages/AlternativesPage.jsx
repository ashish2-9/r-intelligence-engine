import { useNavigate } from "react-router-dom";
import { alternatives } from "../data/dummyData";

export default function AlternativesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">All Options</h2>
        <p className="text-sm text-stone-500 mt-1">
          Exploring the complete waste hierarchy from reuse to recovery.
        </p>
      </div>

      {/* Recommended Alternative Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">● Recommended Alternative</span>
        </div>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Level 1: Refuse & Redesign</p>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">
              Stainless Steel Tiered Bento System
            </h3>
            <div className="flex gap-4 mb-3">
              <div className="bg-green-50 rounded-lg px-3 py-1.5">
                <p className="text-xs text-stone-400">Lifespan</p>
                <p className="text-sm font-bold text-green-700">15+ Years</p>
              </div>
              <div className="bg-green-50 rounded-lg px-3 py-1.5">
                <p className="text-xs text-stone-400">Waste Reduction</p>
                <p className="text-sm font-bold text-green-700">99.4%</p>
              </div>
            </div>
            <p className="text-sm text-stone-500">
              The absolute best choice for this workflow. By transitioning to high-grade 304 stainless steel,
              you eliminate 400+ annual disposals per unit. Fully recyclable at end-of-life.
            </p>
            <button
              onClick={() => navigate("/decision")}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Transition to this Option →
            </button>
          </div>
          <div className="w-40 h-40 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-6xl">🥡</span>
          </div>
        </div>
      </div>

      {/* All Alternatives */}
      <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">The Circular Spectrum</h4>
      <p className="text-xs text-stone-400 mb-4">Exploring the complete waste hierarchy from reuse to recovery.</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {alternatives.map((alt) => (
          <div key={alt.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3 ${
              alt.tag === "RECOMMENDED" ? "border-green-300" : "border-stone-200"
            }`}>

            {/* Tag */}
            {alt.tag && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${
                alt.tag === "RECOMMENDED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {alt.tag}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-lg font-bold text-stone-800">{alt.title}</h4>
                <span className="text-sm font-bold text-green-600">{alt.carbonImpact}</span>
              </div>
              <p className="text-xs text-stone-400">{alt.effort}</p>
            </div>

            <p className="text-sm text-stone-500">{alt.description}</p>

            <div className="flex flex-col gap-1.5 mt-auto">
              {alt.pros.map((pro) => (
                <div key={pro} className="flex items-start gap-2 text-xs text-stone-500">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-400">
              <span>⏱ {alt.hours}</span>
              <span>💰 {alt.estimatedCost}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Circular Spectrum Cards */}
      <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">More Circular Options</h4>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            level: "Level 2: Reuse",
            tag: "Recommend",
            title: "Borosilicate Glass Suite",
            desc: "Highly durable, non-porous, and 100% inert. Ideal for long-term food storage ecosystems.",
            co2: "-42kg/yr",
            color: "bg-stone-800",
          },
          {
            level: "Level 3: Return",
            tag: "Circular",
            title: "Mycelium Bio-Composite",
            desc: "Grown from mushroom roots and agricultural waste. Home compostable in under 45 days.",
            co2: "-28kg/yr",
            color: "bg-amber-700",
          },
          {
            level: "Level 4: Recycle",
            tag: "Circular",
            title: "Post-Consumer RPET",
            desc: "Closed-loop recycled plastic. Uses 75% less energy than virgin plastic production.",
            co2: "-8kg/yr",
            color: "bg-green-700",
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className={`w-full h-24 ${item.color} rounded-xl mb-4 flex items-center justify-center`}>
              <span className="text-white text-3xl">♻️</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-stone-400">{item.level}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
            </div>
            <h5 className="font-bold text-stone-800 mb-2">{item.title}</h5>
            <p className="text-xs text-stone-500 mb-3">{item.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600 font-semibold">CO2e: {item.co2}</span>
              <button className="text-xs text-stone-400 hover:text-stone-600">→</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}