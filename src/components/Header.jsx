import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LangContext } from '../context/LangContext';

export default function Header({ isAuthenticated, onLogout, activeTab, setActiveTab }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { lang, toggleLang, t } = useContext(LangContext);

  return (
    <header className="px-6 py-4 max-w-7xl w-full mx-auto flex items-center justify-between select-none">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cozy-accent rounded-xl flex items-center justify-center text-white font-serif text-base shadow-sm">
            s
          </div>
          <span className="font-semibold tracking-tight text-lg text-cozy-text dark:text-cozy-dark-text">
            subtrack
          </span>
        </div>

        {isAuthenticated && (
          <nav className="flex items-center gap-1 bg-cozy-card/60 dark:bg-cozy-dark-card/60 p-1 rounded-2xl border border-cozy-border/40 dark:border-cozy-dark-border/40">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cozy-card dark:bg-cozy-dark-card text-cozy-accent dark:text-emerald-400 shadow-xs'
                  : 'text-cozy-muted dark:text-cozy-dark-muted hover:text-cozy-text dark:hover:text-cozy-dark-text'
              }`}
            >
              {t('nav.overview')}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-cozy-card dark:bg-cozy-dark-card text-cozy-accent dark:text-emerald-400 shadow-xs'
                  : 'text-cozy-muted dark:text-cozy-dark-muted hover:text-cozy-text dark:hover:text-cozy-dark-text'
              }`}
            >
              {t('nav.analytics')}
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-xl bg-cozy-card/80 dark:bg-cozy-dark-card/80 border border-cozy-border/40 dark:border-cozy-dark-border/40 hover:bg-cozy-card dark:hover:bg-cozy-dark-card transition-all font-semibold text-cozy-accent dark:text-emerald-400 cursor-pointer"
        >
          {lang.toUpperCase()}
        </button>

        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl bg-cozy-card/80 dark:bg-cozy-dark-card/80 border border-cozy-border/40 dark:border-cozy-dark-border/40 hover:bg-cozy-card dark:hover:bg-cozy-dark-card transition-all font-medium text-cozy-muted dark:text-cozy-dark-muted cursor-pointer"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>

        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="ml-2 px-3 py-1.5 rounded-xl bg-cozy-alert/10 text-cozy-alert hover:bg-cozy-alert/20 transition-all font-medium cursor-pointer"
          >
            {t('nav.logout')}
          </button>
        )}
      </div>
    </header>
  );
}