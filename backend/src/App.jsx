import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AnalyzePage from "./pages/AnalyzePage";
import DecisionPage from "./pages/DecisionPage";
import ExplanationPage from "./pages/ExplanationPage";
import AlternativesPage from "./pages/AlternativesPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/analyze" replace />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="decision" element={<DecisionPage />} />
          <Route path="explanation" element={<ExplanationPage />} />
          <Route path="alternatives" element={<AlternativesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
