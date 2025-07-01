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
    console.log('🔍 Sprawdzanie sesji...');
    console.log('🌐 API_URL:', API_URL);
    console.log('📡 Wysyłanie żądania do:', `${API_URL}/auth/me`);
    
    fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => {
        console.log('✅ Odpowiedź z /auth/me:', res.status, res.statusText);
        console.log('🔐 Czy zalogowany:', res.ok);
        setIsLoggedIn(res.ok);
      })
      .catch((error) => {
        console.error('❌ Błąd podczas sprawdzania sesji:', error);
        console.log('🔐 Ustawiam isLoggedIn na false');
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogin = () => {
    console.log('🔐 Logowanie udane - ustawiam isLoggedIn na true');
    setIsLoggedIn(true);
  };

  console.log('🎯 Stan isLoggedIn:', isLoggedIn);

  if (isLoggedIn === null) {
    console.log('⏳ Pokazuję spinner sprawdzania sesji');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sprawdzanie sesji...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 Renderuję główną aplikację, isLoggedIn:', isLoggedIn);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />}
        <main className={isLoggedIn ? 'pt-0' : 'pt-0'}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Invoices /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/login"
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
