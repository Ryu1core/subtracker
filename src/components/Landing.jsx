import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LangContext } from '../context/LangContext';

export default function Landing({ onOpenAuth }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { lang, toggleLang } = useContext(LangContext);

  const isRu = lang === 'ru';

  return (
    <div className="min-h-screen bg-cozy-bg dark:bg-cozy-dark-bg text-cozy-text dark:text-cozy-dark-text ambient-bg transition-colors duration-300 flex flex-col justify-between selection:bg-cozy-accent selection:text-white">
      
      {/* Шапка */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cozy-accent rounded-full flex items-center justify-center text-white font-serif text-base shadow-sm">
            s
          </div>
          <span className="font-semibold tracking-tight text-xl">subtrack</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 text-xs text-cozy-muted dark:text-cozy-dark-muted">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-xl bg-cozy-card dark:bg-cozy-dark-card border border-cozy-border dark:border-cozy-dark-border hover:scale-105 active:scale-95 transition-all font-semibold tracking-wider text-cozy-accent cursor-pointer"
          >
            {lang.toUpperCase()}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cozy-card dark:bg-cozy-dark-card border border-cozy-border dark:border-cozy-dark-border hover:scale-105 active:scale-95 transition-all font-medium cursor-pointer"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={() => onOpenAuth('login')}
            className="ml-2 px-4 py-2 rounded-xl bg-cozy-accent text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {isRu ? 'Войти' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center space-y-12 md:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cozy-accent/10 text-cozy-accent text-xs font-semibold tracking-wide">
            ✨ {isRu ? 'Твой личный финансовый лаунж' : 'Your personal financial lounge'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight leading-tight">
            {isRu ? 'Управляй подписками без лишнего хаоса' : 'Manage subscriptions without the chaos'}
          </h1>
          
          <p className="text-sm md:text-base text-cozy-muted dark:text-cozy-dark-muted max-w-xl mx-auto leading-relaxed">
            {isRu 
              ? 'Контролируй регулярные списания, находи забытые сервисы и шери расходы с друзьями в минималистичном интерфейсе.'
              : 'Keep track of recurring payments, find forgotten services, and split costs with friends in a cozy UI.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cozy-accent text-white font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {isRu ? 'Начать бесплатно' : 'Get Started'}
            </button>
          </div>
        </div>

        {/* Фичи */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-cozy-card dark:bg-cozy-dark-card p-8 rounded-cozy border border-cozy-border/60 dark:border-cozy-dark-border/60 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cozy-accent/10 text-cozy-accent flex items-center justify-center text-xl">
              👻
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">
                {isRu ? 'Детектор «Призраков»' : 'Ghost Subscription Detector'}
              </h3>
              <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted leading-relaxed">
                {isRu 
                  ? 'Автоматически подсвечиваем сервисы, за которые ты платишь, но давно не используешь.'
                  : 'Automatically highlights services you pay for but rarely use.'}
              </p>
            </div>
          </div>

          <div className="bg-cozy-card dark:bg-cozy-dark-card p-8 rounded-cozy border border-cozy-border/60 dark:border-cozy-dark-border/60 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cozy-accent/10 text-cozy-accent flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">
                {isRu ? 'Шеринг и Долги' : 'Shared Expenses & Debts'}
              </h3>
              <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted leading-relaxed">
                {isRu 
                  ? 'Дели семейные подписки с друзьями. Трекер сам посчитает доли и напомнит вернуть долг.'
                  : 'Split family plans with friends. Subtrack calculates shares and tracks who owes what.'}
              </p>
            </div>
          </div>

          <div className="bg-cozy-card dark:bg-cozy-dark-card p-8 rounded-cozy border border-cozy-border/60 dark:border-cozy-dark-border/60 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cozy-accent/10 text-cozy-accent flex items-center justify-center text-xl">
              📈
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">
                {isRu ? 'Уведомления и Графики' : 'Analytics & Alerts'}
              </h3>
              <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted leading-relaxed">
                {isRu 
                  ? 'Наглядные расходы в месяц, предсказание списаний и нотификации за 3 дня до оплаты.'
                  : 'Visual monthly breakdown, subscription predictions, and notifications before billing.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 border-t border-cozy-border/40 dark:border-cozy-dark-border/40 text-xs text-cozy-muted dark:text-cozy-dark-muted flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div>Have a wonderful day. Securely connected.</div>
        <div>© 2026 subtrack lounge</div>
      </footer>
    </div>
  );
}