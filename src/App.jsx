import React, { useState, useEffect, useContext } from 'react';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import Analytics from './components/Analytics';
import CalmRegistry from './components/CalmRegistry';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider, LangContext } from './context/LangContext';
import { subscriptionApi } from './services/api';

function MainLayout() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useContext(LangContext);

  const fetchApiData = async () => {
    try {
      const [list, total] = await Promise.all([
        subscriptionApi.getAll(),
        subscriptionApi.getTotalExpenses()
      ]);
      setSubscriptions(list);
      setTotalExpenses(total);
    } catch (err) {
      console.error("Database connection fault:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <div className="h-full flex flex-col min-h-screen bg-cozy-bg dark:bg-cozy-dark-bg text-cozy-text dark:text-cozy-dark-text ambient-bg antialiased">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">


        <div className="opacity-90">
          <h1 className="text-xl font-normal tracking-tight">
            {t('welcome')}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-cozy-muted animate-pulse">
            {t('status.loading')}
          </div>
        ) : (
          <>
            <StatusCards subscriptions={subscriptions} total={totalExpenses} />
            <Analytics subscriptions={subscriptions} total={totalExpenses} />
            <CalmRegistry subscriptions={subscriptions} onDataChange={fetchApiData} />
          </>
        )}
      </main>
      <footer className="max-w-7xl w-full mx-auto px-8 py-6 border-t border-cozy-sage/30 dark:border-cozy-dark-sage/20 text-xs text-cozy-muted dark:text-cozy-dark-muted flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
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