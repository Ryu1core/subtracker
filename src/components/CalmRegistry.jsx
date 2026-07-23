import React, { useState, useContext } from 'react';
import { LangContext } from '../context/LangContext';
import { subscriptionApi } from '../services/api';

export default function CalmRegistry({ subscriptions = [], onDataChange }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [adding, setAdding] = useState(false);
  const { t } = useContext(LangContext);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    setAdding(true);
    try {
      // Исправлено: вызываем .create() вместо несуществующего .add()
      await subscriptionApi.create({
        name,
        price: parseFloat(price),
        nextBillingDate: billingDate || new Date().toISOString().split('T')[0]
      });
      setName('');
      setPrice('');
      setBillingDate('');
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Ошибка добавления подписки:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await subscriptionApi.delete(id);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Ошибка удаления подписки:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Форма добавления */}
      <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs">
        <h3 className="text-sm font-medium mb-4 text-cozy-text dark:text-cozy-dark-text">
          {t('registry.add_title')}
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('registry.name_placeholder')}
            className="px-4 py-2.5 rounded-xl bg-cozy-bg/60 dark:bg-cozy-dark-bg/60 border border-cozy-border/30 dark:border-cozy-dark-border/30 focus:outline-none focus:border-cozy-accent text-xs transition-all"
          />
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t('registry.price_placeholder')}
            className="px-4 py-2.5 rounded-xl bg-cozy-bg/60 dark:bg-cozy-dark-bg/60 border border-cozy-border/30 dark:border-cozy-dark-border/30 focus:outline-none focus:border-cozy-accent text-xs transition-all"
          />
          <input
            type="date"
            value={billingDate}
            onChange={(e) => setBillingDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-cozy-bg/60 dark:bg-cozy-dark-bg/60 border border-cozy-border/30 dark:border-cozy-dark-border/30 focus:outline-none focus:border-cozy-accent text-xs transition-all text-cozy-muted"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2.5 rounded-xl bg-cozy-accent text-white font-medium text-xs hover:bg-cozy-accent-hover active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {adding ? '...' : t('registry.add_button')}
          </button>
        </form>
      </div>

      {/* Список подписок */}
      <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs space-y-4">
        <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
          {t('registry.your_subs')}
        </h3>

        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-xs text-cozy-muted dark:text-cozy-dark-muted">
            {t('registry.empty')}
          </div>
        ) : (
          <div className="divide-y divide-cozy-border/20 dark:divide-cozy-dark-border/20">
            {subscriptions.map((sub) => (
              <div
                key={sub.id || sub._id}
                className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 group"
              >
                <div>
                  <div className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
                    {sub.name}
                  </div>
                  {sub.nextBillingDate && (
                    <div className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted mt-0.5">
                      Списание: {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    ${parseFloat(sub.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(sub.id || sub._id)}
                    className="opacity-0 group-hover:opacity-100 text-cozy-muted hover:text-cozy-alert text-xs transition-all cursor-pointer p-1"
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}