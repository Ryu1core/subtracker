import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LangContext } from '../context/LangContext';

export default function Header() {
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const { lang, toggleLang, t } = useContext(LangContext);

    return (
        <header className="px-8 py-4 max-w-7xl w-full mx-auto flex items-center justify-between select-none">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-cozy-accent rounded-full flex items-center justify-center text-white font-serif text-sm">
                        s
                    </div>
                    <span className="font-semibold tracking-tight text-lg">subtrack</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-cozy-muted dark:text-cozy-dark-muted">
                    <a href="#" className="text-cozy-text dark:text-cozy-dark-text border-b-2 border-cozy-accent pb-1">
                        {t('nav.overview')}
                    </a>
                    <a href="#" className="hover:text-cozy-text dark:hover:text-cozy-dark-text">
                        {t('nav.analytics')}
                    </a>
                    <a href="#" className="hover:text-cozy-text dark:hover:text-cozy-dark-text">
                        {t('nav.budget')}
                    </a>
                </nav>
            </div>

            <div className="flex items-center gap-4 text-sm text-cozy-muted dark:text-cozy-dark-muted">

                <button
                    onClick={toggleLang}
                    className="px-2.5 py-1 rounded-xl bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage/40 dark:border-cozy-dark-sage/60 cozy-shadow hover:scale-105 active:scale-95 transition-all text-[11px] font-semibold tracking-wider text-cozy-accent"
                >
                    {lang.toUpperCase()}
                </button>


                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage/40 dark:border-cozy-dark-sage/60 cozy-shadow hover:scale-105 active:scale-95 transition-all text-xs font-medium"
                >
                    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>
        </header>
    );
}