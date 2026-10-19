import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell";
import { RequireAuth, RequireGuest } from "./components/RouteGuards";
import Contests from "./pages/Contests";
import Dashboard from "./pages/Dashboard";
import DSA from "./pages/DSA";
import Forgot from "./pages/auth/Forgot";
import Goals from "./pages/Goals";
import Hackathons from "./pages/Hackathons";
import Interview from "./pages/Interview";
import Login from "./pages/auth/Login";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Register from "./pages/auth/Register";
import Roadmaps from "./pages/Roadmaps";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route
          path="/auth/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />
        <Route
          path="/auth/register"
          element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          }
        />
        <Route
          path="/auth/forgot"
          element={
            <RequireGuest>
              <Forgot />
            </RequireGuest>
          }
        />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dsa" element={<DSA />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contests" element={<Contests />} />
          <Route path="hackathons" element={<Hackathons />} />
          <Route path="goals" element={<Goals />} />
          <Route path="notes" element={<Notes />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="interview" element={<Interview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </>
  );
}
