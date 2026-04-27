export default function FormCard({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      {children}
    </div>
  );
}