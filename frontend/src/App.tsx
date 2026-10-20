import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";
import { I18nProvider } from "./i18n";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { FarmAIAssistant } from "./components/FarmAIAssistant";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";
import { YieldPredictionPage } from "./pages/YieldPredictionPage";
import { SimulationPage } from "./pages/SimulationPage";
import { CropHealthPage } from "./pages/CropHealthPage";
import { WaterPage } from "./pages/WaterPage";
import { SoilPage } from "./pages/SoilPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DataQualityPage } from "./pages/DataQualityPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { ProfilePage } from "./pages/ProfilePage";

const AppShell: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/profile/setup";

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col text-black font-sans selection:bg-black selection:text-white bg-[#FFFFFF]">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/profile/setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-black font-sans selection:bg-black selection:text-white bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-65px)]">
        <Routes>
          <Route
            path="/farm"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/twin"
            element={
              <ProtectedRoute>
                <DigitalTwinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <CropHealthPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-health"
            element={
              <ProtectedRoute>
                <CropHealthPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute>
                <WaterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/soil"
            element={
              <ProtectedRoute>
                <SoilPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/predictions"
            element={
              <ProtectedRoute>
                <YieldPredictionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/yield"
            element={
              <ProtectedRoute>
                <YieldPredictionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute>
                <SimulationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/what-if"
            element={
              <ProtectedRoute>
                <SimulationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/what-should-i-do"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-quality"
            element={
              <ProtectedRoute>
                <DataQualityPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/farm" replace />} />
        </Routes>
      </main>
      <FarmAIAssistant />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <FarmProvider>
            <AppShell />
          </FarmProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;
