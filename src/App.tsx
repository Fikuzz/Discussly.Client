import './App.css';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import React from 'react';

function RedirectToCurrentUser() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUserId = user?.id;

  React.useEffect(() => {
    if(loading) return;
    if(!currentUserId) {
      console.log('No current user ID, redirecting to home.');
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
              <Route path="/" element={
                <div className='main'>
                  <h2>Добро пожаловать в Discussly!</h2>
                  <p>Здесь будут посты и обсуждения...</p>
                </div>
              }/>
              <Route path="/profile" element={ < RedirectToCurrentUser /> } />
              <Route path="/profile/:id" element={ < ProfilePage /> } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;