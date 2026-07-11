import React, { useEffect, useRef, useContext } from 'react';
import { Chart, registerables } from 'chart.js';
import { ThemeContext } from '../context/ThemeContext';
import { LangContext } from '../context/LangContext';

Chart.register(...registerables);

export default function Analytics({ subscriptions, total }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { isDark } = useContext(ThemeContext);
    const { t } = useContext(LangContext);

    const chartLabels = subscriptions.map(s => s.name.toUpperCase()).slice(0, 5);
    const chartData = subscriptions.map(s => s.price).slice(0, 5);

    if (subscriptions.length > 5) {
        chartLabels.push(t('analytics.others'));
        const remainingSum = subscriptions.slice(5).reduce((sum, s) => sum + s.price, 0);
        chartData.push(remainingSum);
    }

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        const getMutedColor = () => isDark ? '#8a998e' : '#7a8a80';
        const getBorderColor = () => isDark ? '#242a25' : '#ffffff';

        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels.length > 0 ? chartLabels : [t('analytics.no_data')],
                datasets: [{
                    data: chartData.length > 0 ? chartData : [1],
                    backgroundColor: ['#8fa89b', '#b2c5bb', '#c5d4cc', '#d6e2dd', '#eaf0ec'],
                    borderColor: getBorderColor(),
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '78%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 8,
                            padding: 12,
                            color: getMutedColor(),
                            font: { family: 'Plus Jakarta Sans', size: 10, weight: '500' }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [subscriptions, isDark, chartLabels, chartData, t]);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30 flex flex-col gap-4">
                <h3 className="text-sm font-semibold">{t('analytics.title')}</h3>
                <div className="h-64 w-full relative flex items-center justify-center p-2">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>

            <div className="lg:col-span-7 bg-[#eaf0ec] dark:bg-[#222b24] p-6 rounded-cozy border border-cozy-sage/40 dark:border-cozy-dark-sage/40 flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <span>🌿</span> {t('analytics.notes_title')}
                    </h3>
                    <div className="space-y-4 text-xs leading-relaxed">
                        <div className="p-3 bg-white/60 dark:bg-cozy-dark-card/60 rounded-xl">
                            <span className="font-semibold text-cozy-accent">{t('analytics.notes_db_title')}</span>
                            <p className="text-cozy-muted dark:text-cozy-dark-muted mt-1">{t('analytics.notes_db_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-cozy-muted dark:text-cozy-dark-muted">{t('analytics.weight_label')}</span>
                        <span className="font-medium">${Number(total).toFixed(2)} / month</span>
                    </div>
                    <div className="w-full bg-cozy-bg dark:bg-cozy-dark-bg rounded-full p-0.5 h-3">
                        <div className="bg-cozy-accent h-full rounded-full" style={{ width: total > 0 ? '100%' : '0%' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}