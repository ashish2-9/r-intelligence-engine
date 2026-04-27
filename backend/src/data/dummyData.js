export const analysisResult = {
  item: "Eames-style Plywood Chair",
  decision: "Direct Reuse",
  ecoIndex: 92,
  recommendation: "Proceed with Purchase",
  verified: true,
  description:
    "This item aligns with 98% of your sustainability goals. It features a circular design profile and minimal carbon footprint relative to industry alternatives.",
  durability: "8.4 Years",
  repairability: "High",
  materialSource: "100% Recycled PET",
  carbonSaved: "12.4kg",
  savedLifetimeCO2: "342kg",
  scores: {
    waterUsage: { label: "Water Usage", value: 30, impact: "Low Impact" },
    productionCarbon: { label: "Production Carbon", value: 55, impact: "Moderate" },
    logistics: { label: "Logistics", value: 15, impact: "Minimal" },
  },
  grades: { ethics: "A+", circular: "B", toxicity: "A" },
};

export const alternatives = [
  {
    id: 1,
    title: "Direct Reuse",
    tag: "RECOMMENDED",
    carbonImpact: "-84%",
    effort: "Moderate Effort",
    description: "Immediate availability for re-entry. Preserves high-value aesthetic appeal. Zero chemical stripping required.",
    pros: ["Immediate availability for re-entry", "Preserves high-value aesthetic appeal", "Zero chemical stripping required"],
    estimatedCost: "$45.00",
    hours: "2.5 hrs",
  },
  {
    id: 2,
    title: "Repair",
    tag: null,
    carbonImpact: "-60%",
    effort: "Moderate Effort",
    description: "Requires minor adhesive curing and surface sanding. Total restoration estimated at 2.5 hours.",
    pros: ["Minor adhesive curing", "Surface sanding", "Low cost restoration"],
    estimatedCost: "$45.50",
    hours: "2.5 hrs",
  },
  {
    id: 3,
    title: "Recycle",
    tag: "LAST RESORT",
    carbonImpact: "-40%",
    effort: "High Energy Cost",
    description: "Materials can be broken down into wood pulp and steel scrap. 45% mass loss during downcycling process.",
    pros: ["Materials recoverable", "Diverts from landfill"],
    estimatedCost: "$12.00",
    hours: "N/A",
  },
];

export const dashboardData = {
  ecoEfficiencyScore: 94.8,
  carbonPrevented: "12.4t",
  energySaved: "480kWh",
  circularRate: "+18%",
  wasteAnalysis: {
    recyclables: 64,
    compost: 22,
    landfill: 14,
  },
  categoryBreakdown: [
    { category: "Consumer Electronics", units: 142, circularity: 87, carbonDelta: "-2.4 kg", status: "OPTIMAL" },
    { category: "Textiles & Apparel", units: 48, circularity: 89, carbonDelta: "-0.1 kg", status: "OPTIMAL" },
    { category: "Organic Waste", units: "89.4 kg", circularity: 45, carbonDelta: "+1.2 kg", status: "ALERT" },
  ],
};