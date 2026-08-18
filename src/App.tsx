import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./auth/AuthPage";
import { WorkshopPage } from "./workshop/WorkshopPage";
import { CultureProvider } from "./components/CultureProvider";
import { CultureDrawer } from "./components/CultureDrawer";

export default function App() {
  return (
    <CultureProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/workshop" element={<WorkshopPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CultureDrawer />
    </CultureProvider>
  );
}
