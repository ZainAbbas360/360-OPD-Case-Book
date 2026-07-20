import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthorHeader from './components/AuthorHeader';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CasePage from './pages/CasePage';
import SubscribePage from './pages/SubscribePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function Shell() {
  const { loading } = useAuth();
  const [page, setPage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink-muted">
        Loading…
      </div>
    );
  }

  let view: React.ReactNode;
  if (page === 'auth') view = <AuthPage onNavigate={setPage} />;
  else if (page === 'home') view = <HomePage onNavigate={setPage} />;
  else if (page === 'subscribe') view = <SubscribePage onNavigate={setPage} />;
  else if (page === 'dashboard') view = <DashboardPage onNavigate={setPage} />;
  else if (page === 'admin') view = <AdminPage onNavigate={setPage} />;
  else if (page.startsWith('case:')) view = <CasePage caseId={page.slice(5)} onNavigate={setPage} />;
  else view = <HomePage onNavigate={setPage} />;

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <Navbar onNavigate={setPage} current={page.startsWith('case:') ? 'home' : page} />
      {page === 'home' && <AuthorHeader />}
      <div className="flex-1">{view}</div>
      <footer className="border-t border-line mt-12 bg-gradient-to-r from-ink to-med-800 text-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm flex flex-col sm:flex-row justify-between gap-2">
          <span>Common OPD Cases — A Clinical Field Book</span>
          <span>By Dr. Muhammad Zain Abbas · Lifetime access Rs 4,499</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <Shell />;
}
