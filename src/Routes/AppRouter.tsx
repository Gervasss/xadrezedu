import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import LoginPage from '../Pages/LoginPage/LoginPage';
import HomePage from '../Pages/HomePage/HomePage';
import LessonPage from '../Pages/Lessons/LessonPage';


// Observa a sessão Firebase e protege as rotas privadas da aplicação.
export default function AppRouter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  }, () => {
    setError(true);
    setLoading(false);
  }), []);

  if (loading) return <main className="session-status" role="status">Carregando sua sessão…</main>;
  if (error) return (
    <main className="session-status">
      <p role="alert">Não foi possível carregar sua sessão.</p>
      <button type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
    </main>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage authenticated={Boolean(user)} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/inicio" element={user ? <HomePage key={user.uid} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/licoes/:lessonId" element={user ? <LessonPage user={user} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
