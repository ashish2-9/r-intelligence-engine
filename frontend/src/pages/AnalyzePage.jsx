import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";

const itemTypes = ["Chair", "Container", "Textile", "Electronics", "Packaging", "Other"];
const conditions = ["Like New", "Good", "Fair", "Poor", "Damaged"];
const contexts = ["Home Use", "Office", "Industrial", "Retail", "Education"];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemType: "",
    condition: "",
    context: "",
    weight: "",
    region: "",
    lifecycle: "4-7",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, image: file }));
  }

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/decision");
    }, 1800);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Analyze Item</h2>
        <p className="text-sm text-stone-500 mt-1">
          Uncover the true environmental narrative of your products using our AI-driven sustainability intelligence engine.
        </p>
      </div>
      <FormCard>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm">📦</span>
          <span className="font-semibold text-stone-700">Product Specifications</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Item Type</label>
            <select name="itemType" value={form.itemType} onChange={handleChange}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
              <option value="">Select Item Type</option>
              {itemTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Manufacturing Region</label>
            <input name="region" value={form.region} onChange={handleChange}
              placeholder="Search City/Country"
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Item Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
              <option value="">Select Condition</option>
              {conditions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Usage Context</label>
            <select name="context" value={form.context} onChange={handleChange}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
              <option value="">Select Context</option>
              {contexts.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Item Weight (kg)</label>
            <input name="weight" value={form.weight} onChange={handleChange}
              type="number" placeholder="0.00"
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-600">Target Lifecycle (Years)</label>
            <div className="flex gap-2">
              {["1-3", "4-7", "8+"].map((val) => (
                <button key={val} onClick={() => setForm((p) => ({ ...p, lifecycle: val }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.lifecycle === val ? "bg-green-600 text-white border-green-600" : "border-stone-200 text-stone-600"
                  }`}>
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-stone-600">Visual Documentation</label>
          <div onDrop={handleImageDrop} onDragOver={(e) => e.preventDefault()}
            className="mt-1.5 border-2 border-dashed border-stone-200 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer bg-stone-50"
            onClick={() => document.getElementById("imageInput").click()}>
            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageDrop} />
            {form.image ? (
              <p className="text-sm text-green-600">📎 {form.image.name}</p>
            ) : (
              <>
                <span className="text-2xl">☁️</span>
                <p className="text-xs text-stone-500">Drop product photo or click to browse</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-stone-400">🔒 <strong className="text-stone-600">Privacy Guaranteed</strong></p>
          <button onClick={handleSubmit} disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>Analyzing...</>
            ) : "Initialize Deep Analysis →"}
          </button>
        </div>
      </FormCard>
    </div>
  );
}