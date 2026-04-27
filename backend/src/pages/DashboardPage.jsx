import { dashboardData } from "../data/dummyData";

const insights = [
  {
    icon: "🌱",
    title: "Conscious Consumption",
    desc: "You've opted for plastic-free packaging in 81% of your recent purchases. This is 12% higher than last month.",
    tag: "+81% Improvement",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    icon: "⚡",
    title: "Energy Peak Usage",
    desc: "Your data center usage peaked between 2 and 4 PM. Shifting tasks to morning hours could reduce your footprint.",
    tag: "Optimization Needed",
    tagColor: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: "🌳",
    title: "Reforestation Impact",
    desc: "Your eco-circular credits funded the planting of 24 indigenous trees in the Amazon Basin region.",
    tag: "5 Trees Planted",
    tagColor: "bg-green-100 text-green-700",
  },
];

const circularOptions = [
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
];

export default function DashboardPage() {
  const data = dashboardData;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Impact Dashboard</h2>
        <p className="text-sm text-stone-500 mt-1">
          Detailed analysis of your circularity and footprint metrics.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2 flex flex-col gap-4">

          <div className="bg-green-600 rounded-2xl p-6 text-white">
            <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Global Ranking: Top 5%</p>
            <div className="flex items-end gap-8">
              <div>
                <p className="text-6xl font-bold">{data.ecoEfficiencyScore}</p>
                <p className="text-sm opacity-80 mt-1">Eco-Efficiency Score</p>
              </div>
              <div className="flex gap-6 mb-2">
                <div>
                  <p className="text-xs opacity-70">Carbon Prevented</p>
                  <p className="text-xl font-bold">{data.carbonPrevented}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Energy Saved</p>
                  <p className="text-xl font-bold">{data.energySaved}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Circular Rate</p>
                  <p className="text-xl font-bold">{data.circularRate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-stone-700">Behavior Insights</h4>
              <button className="text-xs text-green-600 font-medium">View All Records</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {insights.map((insight) => (
                <div key={insight.title} className="bg-stone-50 rounded-xl p-4">
                  <span className="text-xl">{insight.icon}</span>
                  <h5 className="text-sm font-semibold text-stone-700 mt-2 mb-1">{insight.title}</h5>
                  <p className="text-xs text-stone-400 leading-relaxed mb-3">{insight.desc}</p>
                  <span className={"text-xs font-semibold px-2 py-1 rounded-full " + insight.tagColor}>
                    {insight.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-stone-700">Category Breakdown</h4>
              <div className="flex gap-2">
                <button className="text-xs border border-stone-200 px-3 py-1 rounded-lg text-stone-500">CSV Export</button>
                <button className="text-xs border border-stone-200 px-3 py-1 rounded-lg text-stone-500">PDF Report</button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-stone-400 uppercase tracking-wide border-b border-stone-100">
                  <th className="text-left pb-2">Item Category</th>
                  <th className="text-left pb-2">Total Units</th>
                  <th className="text-left pb-2">Circularity</th>
                  <th className="text-left pb-2">Carbon Delta</th>
                  <th className="text-left pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.categoryBreakdown.map((row) => (
                  <tr key={row.category} className="border-b border-stone-50 text-sm">
                    <td className="py-3 text-stone-700 font-medium">{row.category}</td>
                    <td className="py-3 text-stone-500">{row.units}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-stone-100 rounded-full h-1.5">
                          <div
                            className={row.status === "ALERT" ? "bg-red-400 h-1.5 rounded-full" : "bg-green-500 h-1.5 rounded-full"}
                            style={{ width: row.circularity + "%" }}
                          ></div>
                        </div>
                        <span className="text-stone-500">{row.circularity}%</span>
                      </div>
                    </td>
                    <td className={"py-3 font-medium " + (row.carbonDelta.startsWith("+") ? "text-red-500" : "text-green-600")}>
                      {row.carbonDelta}
                    </td>
                    <td className="py-3">
                      <span className={"text-xs font-bold px-2 py-1 rounded-full " + (row.status === "OPTIMAL" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h4 className="font-semibold text-stone-700 mb-4">Waste Analysis</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Recyclables", value: data.wasteAnalysis.recyclables, color: "bg-green-500" },
                { label: "Compost", value: data.wasteAnalysis.compost, color: "bg-yellow-500" },
                { label: "Landfill", value: data.wasteAnalysis.landfill, color: "bg-red-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className={"w-2 h-2 rounded-full " + item.color}></span>
                      {item.label}
                    </span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className={item.color + " h-2 rounded-full"} style={{ width: item.value + "%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h4 className="font-semibold text-stone-700 mb-1">Monthly Trend</h4>
            <p className="text-xs text-stone-400 mb-4">Eco score over time</p>
            <div className="flex items-end gap-1.5 h-28">
              {[60, 65, 70, 68, 75, 80, 85, 82, 88, 90, 92, 94].map((val, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="w-full rounded-t-sm bg-green-500"
                    style={{ height: val + "%" }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-stone-400 mt-2">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>

          <div className="bg-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span>✨</span>
              <p className="text-sm font-bold">Intelligent Insight</p>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Switching to the Stainless Steel Bento System would eliminate your supply waste and lower your supply chain emissions by 38%.
            </p>
          </div>

          <div className="bg-stone-800 rounded-2xl p-4 text-white text-center">
            <p className="text-xs opacity-60 uppercase tracking-wide">System Status</p>
            <p className="text-xs text-green-400 font-semibold mt-1">Live Intelligence Active</p>
          </div>

        </div>
      </div>
    </div>
  );
}