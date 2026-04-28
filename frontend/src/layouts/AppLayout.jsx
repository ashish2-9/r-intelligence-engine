import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const pageTitles = {
  "/analyze":      "Analyze Item",
  "/decision":     "Decision Result",
  "/explanation":  "Decision Reasoning",
  "/alternatives": "All Options",
  "/dashboard":    "Impact Dashboard",
};

export default function AppLayout({ onLogout }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "R-Intelligence";

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={title} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}