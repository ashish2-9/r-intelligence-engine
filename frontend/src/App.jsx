import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import AnalyzePage from "./pages/AnalyzePage";
import DecisionPage from "./pages/DecisionPage";
import ExplanationPage from "./pages/ExplanationPage";
import AlternativesPage from "./pages/AlternativesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { getStoredUser, setStoredUser, clearStoredUser } from "./api";

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const isLoggedIn = Boolean(user);

  const handleLogin = (userData) => {
    setUser(userData);
    setStoredUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    clearStoredUser();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/analyze" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/signup" element={
          isLoggedIn ? <Navigate to="/analyze" replace /> : <SignupPage onLogin={handleLogin} />
        } />
        <Route
          path="/"
          element={isLoggedIn ? <AppLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="/analyze" replace />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="decision" element={<DecisionPage />} />
          <Route path="explanation" element={<ExplanationPage />} />
          <Route path="alternatives" element={<AlternativesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
