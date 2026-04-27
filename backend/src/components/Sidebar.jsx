import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/analyze",      label: "Analyze Item",     icon: "🔍" },
  { path: "/decision",     label: "Decision Result",  icon: "✅" },
  { path: "/explanation",  label: "Reasoning",        icon: "🧠" },
  { path: "/alternatives", label: "All Options",      icon: "☰" },
  { path: "/dashboard",    label: "Impact Dashboard", icon: "📊" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-stone-200 flex flex-col py-6 px-3 shrink-0">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">R</span>
        </div>
        <div>
          <p className="text-xs font-bold text-stone-800 leading-tight">R-Intelligence</p>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Eco-Intelligence System</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-3">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
          + New Analysis
        </button>
      </div>
    </aside>
  );
}