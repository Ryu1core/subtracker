import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';

export default function StatusCards({ subscriptions = [], total = 0 }) {
  const { t } = useContext(LangContext);

  const activeCount = subscriptions.length;
  const urgentCount = subscriptions.filter((s) => {
    if (!s.nextBillingDate) return false;
    const diff = new Date(s.nextBillingDate) - new Date();
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  }).length;

  const avgCost = activeCount > 0 ? (total / activeCount).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-cozy-card dark:bg-cozy-dark-card p-5 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs transition-all hover:border-cozy-border/60">
        <span className="text-[10px] font-semibold tracking-wider text-cozy-muted dark:text-cozy-dark-muted uppercase">
          {t('status.active_subs')}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-light tracking-tight">{activeCount}</span>
          <span className="text-xs text-cozy-muted dark:text-cozy-dark-muted">{t('status.pcs')}</span>
        </div>
        <p className="mt-2 text-[11px] text-cozy-muted/80 dark:text-cozy-dark-muted/80">
          {t('status.all_active')}
        </p>
      </div>

      <div className="bg-cozy-card dark:bg-cozy-dark-card p-5 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs transition-all hover:border-cozy-border/60">
        <span className="text-[10px] font-semibold tracking-wider text-cozy-muted dark:text-cozy-dark-muted uppercase">
          {t('status.monthly_exp')}
        </span>
        <div className="mt-2 text-3xl font-light tracking-tight">
          ${total.toFixed(2)}
        </div>
        <p className="mt-2 text-[11px] text-cozy-muted/80 dark:text-cozy-dark-muted/80">
          {t('status.exchange_rate')}
        </p>
      </div>

      <div className="bg-cozy-card dark:bg-cozy-dark-card p-5 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs transition-all hover:border-cozy-border/60">
        <span className="text-[10px] font-semibold tracking-wider text-cozy-muted dark:text-cozy-dark-muted uppercase">
          {t('status.attention')}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-light tracking-tight text-cozy-alert">
            {urgentCount}
          </span>
          <span className="text-xs text-cozy-muted dark:text-cozy-dark-muted">{t('status.charges')}</span>
        </div>
        <p className="mt-2 text-[11px] text-cozy-muted/80 dark:text-cozy-dark-muted/80">
          {t('status.next_3_days')}
        </p>
      </div>

      <div className="bg-cozy-card dark:bg-cozy-dark-card p-5 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs transition-all hover:border-cozy-border/60">
        <span className="text-[10px] font-semibold tracking-wider text-cozy-muted dark:text-cozy-dark-muted uppercase">
          {t('status.avg_cost')}
        </span>
        <div className="mt-2 text-3xl font-light tracking-tight">
          ${avgCost}
        </div>
        <p className="mt-2 text-[11px] text-cozy-muted/80 dark:text-cozy-dark-muted/80">
          {t('status.per_sub')}
        </p>
      </div>
    </div>
  );
}