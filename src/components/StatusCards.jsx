import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';

export default function StatusCards({ subscriptions, total }) {
    const { t } = useContext(LangContext);

    const urgentCount = subscriptions.filter(sub => {
        const days = Math.ceil((new Date(sub.billingDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 3;
    }).length;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Subscriptions */}
            <div className="bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30 flex flex-col justify-between">
                <span className="text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted tracking-wide">{t('status.active_title')}</span>
                <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-normal tracking-tight">{subscriptions.length}</span>
                    <span className="text-sm text-cozy-muted dark:text-cozy-dark-muted">{t('status.active_unit')}</span>
                </div>
                <div className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted mt-4 pt-3 border-t border-gray-100 dark:border-cozy-dark-sage/30">
                    {t('status.active_footer_1')}<span className="text-cozy-accent font-medium">{t('status.active_footer_2')}</span>
                </div>
            </div>

            {/* Monthly Expenses */}
            <div className="bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30 flex flex-col justify-between">
                <span className="text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted tracking-wide">{t('status.expenses_title')}</span>
                <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-normal tracking-tight">${Number(total).toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted mt-4 pt-3 border-t border-gray-100 dark:border-cozy-dark-sage/30">
                    {t('status.expenses_footer')}
                </div>
            </div>

            {/* Urgent Review */}
            <div className="bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30 flex flex-col justify-between">
                <span className="text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted tracking-wide">{t('status.urgent_title')}</span>
                <div className="flex items-baseline gap-2 mt-4">
                    <span className={`text-4xl font-normal tracking-tight ${urgentCount > 0 ? 'text-cozy-alert' : 'text-cozy-accent'}`}>
                        {urgentCount} {urgentCount === 1 ? t('status.urgent_unit_one') : t('status.urgent_unit_many')}
                    </span>
                </div>
                <div className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted mt-4 pt-3 border-t border-gray-100 dark:border-cozy-dark-sage/30">
                    {t('status.urgent_footer')}
                </div>
            </div>

            {/* Average Cost */}
            <div className="bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30 flex flex-col justify-between">
                <span className="text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted tracking-wide">{t('status.average_title')}</span>
                <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-normal text-cozy-accent tracking-tight">
                        ${subscriptions.length > 0 ? (total / subscriptions.length).toFixed(2) : '0.00'}
                    </span>
                </div>
                <div className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted mt-4 pt-3 border-t border-gray-100 dark:border-cozy-dark-sage/30">
                    {t('status.average_footer')}
                </div>
            </div>
        </section>
    );
}