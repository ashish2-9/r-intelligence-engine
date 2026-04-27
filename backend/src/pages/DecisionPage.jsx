import { useNavigate } from "react-router-dom";
import { analysisResult } from "../data/dummyData";

export default function DecisionPage() {
  const navigate = useNavigate();
  const data = analysisResult;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Decision Result</h2>
        <p className="text-sm text-stone-500 mt-1">
          AI-powered sustainability decision for your item.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Left Card - Main Decision */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Sustainability</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-stone-800 leading-tight">
              Proceed with Purchase
            </h3>
          </div>

          <p className="text-sm text-stone-500 leading-relaxed">
            {data.description}
          </p>

          {/* Eco Index Ring */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e7e5e4" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#16a34a" strokeWidth="10"
                  strokeDasharray={`${data.ecoIndex * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-stone-800">{data.ecoIndex}</span>
                <span className="text-xs text-stone-400 uppercase tracking-wide">Eco-Index</span>
              </div>
            </div>
          </div>

          {/* Durability & Repairability */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-xs text-stone-400">Durability</p>
              <p className="text-lg font-bold text-stone-800">{data.durability}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-xs text-stone-400">Repairability</p>
              <p className="text-lg font-bold text-stone-800">{data.repairability}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/alternatives")}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            View All Options
          </button>
        </div>

        {/* Middle Card - AI Insight + Impact */}
        <div className="flex flex-col gap-4">

          {/* AI Insight */}
          <div className="bg-green-600 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2">🤖 AI Insight</p>
            <p className="text-sm leading-relaxed">
              Choosing this item prevents{" "}
              <span className="font-bold text-yellow-300">{data.carbonSaved}</span>{" "}
              of CO2 emission compared to the market average.
            </p>
            <button
              onClick={() => navigate("/explanation")}
              className="mt-4 bg-white text-green-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              View Carbon Offset Options →
            </button>
          </div>

          {/* Impact Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-stone-700">Impact Breakdown</h4>
            </div>
            <div className="flex flex-col gap-4">
              {Object.values(data.scores).map((score) => (
                <div key={score.label}>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        score.impact === "Low Impact" ? "bg-green-500" :
                        score.impact === "Moderate" ? "bg-yellow-500" : "bg-blue-500"
                      }`}></span>
                      {score.label}
                    </span>
                    <span className="text-stone-400">{score.impact}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        score.impact === "Low Impact" ? "bg-green-500" :
                        score.impact === "Moderate" ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${score.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grades */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              {Object.entries(data.grades).map(([key, val]) => (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold text-stone-800">{val}</p>
                  <p className="text-xs text-stone-400 uppercase">{key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card - Forecast */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col gap-4">
          <h4 className="font-semibold text-stone-700">Forecast</h4>
          <p className="text-xs text-stone-400">Projected impact over 5 years.</p>

          {/* Simple Bar Chart */}
          <div className="flex items-end gap-2 h-32 mt-2">
            {[40, 55, 65, 72, 80, 88, 92].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-green-500"
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-stone-400">
            <span>2024</span>
            <span>2028</span>
          </div>

          {/* Saved CO2 */}
          <div className="bg-stone-50 rounded-xl p-4 mt-2">
            <p className="text-xs text-stone-400 uppercase tracking-wide">Saved Lifetime CO2</p>
            <p className="text-3xl font-bold text-stone-800 mt-1">{data.savedLifetimeCO2}</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% higher than prev model</p>
          </div>

          <button
            onClick={() => navigate("/explanation")}
            className="w-full border border-stone-200 text-stone-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            View Reasoning →
          </button>
        </div>

      </div>
    </div>
  );
}