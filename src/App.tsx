import "./App.css";
import Header from "./components/Header";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./providers/AuthProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import React from "react";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";

function RedirectToCurrentUser() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUserId = user?.id;

  React.useEffect(() => {
    if (loading) return;
    if (!currentUserId) {
      console.log("No current user ID, redirecting to home.");
      navigate("/");
    } else {
      navigate(`/profile/${currentUserId}`);
    }
  }, [navigate, currentUserId]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/profile" element={<RedirectToCurrentUser />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/community/:id" element={<CommunityPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
