export default function Navbar({ title = "Analyze Item" }) {
  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-stone-700">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-eco-600 bg-eco-50 border border-eco-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse"></span>
          Live Assessment
        </span>
        <div className="w-8 h-8 rounded-full bg-eco-500 text-white text-xs font-bold flex items-center justify-center">
          AR
        </div>
      </div>
    </header>
  );
}