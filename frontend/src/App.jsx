// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import { API_URL } from './config.js';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sprawdzanie sesji...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />}
        <main className={isLoggedIn ? 'pt-0' : 'pt-0'}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Invoices /> : <Navigate to="/auth/login" replace />
              }
            />
            <Route
              path="/auth/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
