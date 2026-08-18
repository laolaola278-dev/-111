import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./auth/AuthPage";
import { WorkshopPage } from "./workshop/WorkshopPage";
import { RequireAuth } from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/workshop"
        element={
          <RequireAuth>
            <WorkshopPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
