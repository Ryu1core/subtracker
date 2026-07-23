import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';

export default function Analytics({ subscriptions = [], total = 0 }) {
  const { lang } = useContext(LangContext);
  const isRu = lang === 'ru';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Детектор призраков подписок */}
      <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">
            👻
          </div>
          <div>
            <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
              {isRu ? 'Призраки подписок' : 'Ghost Subscriptions'}
            </h3>
            <p className="text-[11px] text-cozy-muted dark:text-cozy-dark-muted">
              {isRu ? 'Подписки, которыми вы давно не пользовались' : 'Subscriptions you haven’t used in a while'}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-cozy-bg/50 dark:bg-cozy-dark-bg/50 border border-cozy-border/20 dark:border-cozy-dark-border/20 text-center text-xs text-cozy-muted dark:text-cozy-dark-muted">
          ✨ {isRu ? 'Призраков не обнаружено! Все подписки активно используются.' : 'No ghosts detected! All active.'}
        </div>
      </div>

      {/* Диаграммы и Распределение */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Распределение трат */}
        <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs space-y-4">
          <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
            {isRu ? 'Распределение трат' : 'Expense Distribution'}
          </h3>

          <div className="h-48 flex items-center justify-center">
            {subscriptions.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 rounded-full border-8 border-cozy-border/30 dark:border-cozy-dark-border/30 border-t-cozy-accent animate-spin-slow" />
                <span className="text-xs text-cozy-muted dark:text-cozy-dark-muted mt-2">
                  {isRu ? 'Нет данных для отображения' : 'No data to display'}
                </span>
              </div>
            ) : (
              <div className="text-xs text-cozy-muted">
                {isRu ? 'Всего расходов: ' : 'Total expenses: '}${total.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* История цен */}
        <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text">
              📈 {isRu ? 'История цен' : 'Price History'}
            </h3>
            <select className="px-2.5 py-1 rounded-lg bg-cozy-bg/60 dark:bg-cozy-dark-bg/60 border border-cozy-border/30 dark:border-cozy-dark-border/30 text-[11px] text-cozy-muted focus:outline-none">
              <option>{isRu ? 'За все время' : 'All time'}</option>
              <option>{isRu ? 'За 6 месяцев' : 'Last 6 months'}</option>
            </select>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-cozy-border/20 dark:border-cozy-dark-border/20">
            {/* Эмуляция гистограммы/графика */}
            {[40, 65, 30, 85, 50, 90, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div 
                  className="w-full bg-cozy-accent/20 group-hover:bg-cozy-accent rounded-t-lg transition-all" 
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-cozy-muted group-hover:text-cozy-text transition-colors">
                  {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Предстоящие списания */}
      <div className="bg-cozy-card dark:bg-cozy-dark-card p-6 rounded-cozy border border-cozy-border/30 dark:border-cozy-dark-border/30 shadow-xs">
        <h3 className="text-sm font-medium text-cozy-text dark:text-cozy-dark-text mb-2">
          📅 {isRu ? 'На этой неделе спишется' : 'Upcoming Billing This Week'}
        </h3>
        <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted">
          {isRu ? 'В ближайшие 7 дней списаний не планируется.' : 'No charges scheduled for the next 7 days.'}
        </p>
      </div>

    </div>
  );
}