import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';

export default function DebtsWidget() {
  const { t } = useContext(LangContext);

  return (
    <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
          {t('debts.title')}
        </h3>
        <span className="text-xs font-semibold text-cozy-accent dark:text-emerald-400 bg-cozy-accent/10 dark:bg-emerald-400/10 px-2.5 py-1 rounded-lg">
          +0.00 ₽/{t('debts.per_month')}
        </span>
      </div>

      <div className="py-8 text-center text-xs text-cozy-muted dark:text-cozy-dark-muted">
        {t('debts.no_debts')} 👍
      </div>
    </div>
  );
}