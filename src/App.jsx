import React, { useState, useEffect, useContext } from 'react';
import Header from './components/Header';
import Landing from './components/Landing';
import StatusCards from './components/StatusCards';
import Analytics from './components/Analytics';
import CalmRegistry from './components/CalmRegistry';
import DebtsWidget from './components/DebtsWidget';
import AuthModal from './components/AuthModal';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider, LangContext } from './context/LangContext';
import { subscriptionApi } from './services/api';

function MainLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [authModalMode, setAuthModalMode] = useState(null); // null, 'login' или 'register'
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useContext(LangContext);

  const fetchApiData = async () => {
    if (!localStorage.getItem('token')) return;
    
    setLoading(true);
    try {
      const [list, total] = await Promise.all([
        subscriptionApi.getAll(),
        subscriptionApi.getTotalExpenses()
      ]);
      setSubscriptions(list || []);
      setTotalExpenses(total || 0);
    } catch (err) {
      console.error("Database connection fault:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSubscriptions([]);
    setTotalExpenses(0);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthModalMode(null);
  };

  // Если пользователь НЕ авторизован — показываем Лендинг и модалку входа/регистрации
  if (!isAuthenticated) {
    return (
      <>
        <Landing onOpenAuth={(mode) => setAuthModalMode(mode)} />
        {authModalMode && (
          <AuthModal
            initialMode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  }

  // Если авторизован — показываем личный кабинет (Дашборд)
  return (
    <div className="min-h-screen flex flex-col bg-cozy-bg dark:bg-cozy-dark-bg text-cozy-text dark:text-cozy-dark-text ambient-bg antialiased transition-colors duration-300">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        <div className="opacity-90">
          <h1 className="text-xl md:text-2xl font-normal tracking-tight">
            {t('welcome')}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-cozy-muted dark:text-cozy-dark-muted animate-pulse">
            {t('status.loading')}
          </div>
        ) : activeTab === 'overview' ? (
          <>
            <StatusCards subscriptions={subscriptions} total={totalExpenses} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CalmRegistry subscriptions={subscriptions} onDataChange={fetchApiData} />
              </div>
              <div className="lg:col-span-1">
                <DebtsWidget />
              </div>
            </div>
          </>
        ) : (
          <Analytics subscriptions={subscriptions} total={totalExpenses} />
        )}
      </main>

      <footer className="max-w-7xl w-full mx-auto px-8 py-6 border-t border-cozy-border/50 dark:border-cozy-dark-border/50 text-xs text-cozy-muted dark:text-cozy-dark-muted flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div>Have a wonderful day. Securely connected.</div>
        <div>© 2026 subtrack lounge</div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <MainLayout />
      </LangProvider>
    </ThemeProvider>
  );
}