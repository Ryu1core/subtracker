import React, { useState, useContext } from 'react';
import { subscriptionApi } from '../services/api';
import { LangContext } from '../context/LangContext';

export default function CalmRegistry({ subscriptions, onDataChange }) {
    const { t } = useContext(LangContext);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [billingDate, setBillingDate] = useState('');
    const [category, setCategory] = useState('');
    const [billingCycle, setBillingCycle] = useState('MONTHLY');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !price || !billingDate) {
            setError(t('registry.form_error'));
            return;
        }

        try {
            await subscriptionApi.create({
                name,
                price: parseFloat(price),
                billingDate,
                category: category || 'service',
                billingCycle
            });
            setName(''); setPrice(''); setBillingDate(''); setCategory(''); setBillingCycle('MONTHLY');
            setShowForm(false);
            onDataChange();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete?')) {
            try {
                await subscriptionApi.delete(id);
                onDataChange();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <section className="bg-cozy-card dark:bg-cozy-dark-card cozy-shadow p-6 rounded-cozy border border-cozy-sage/30 dark:border-cozy-dark-sage/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-cozy-dark-sage/20 pb-4 mb-4">
                <div>
                    <h3 className="text-sm font-semibold">{t('registry.title')}</h3>
                    <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted mt-0.5">{t('registry.subtitle')}</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-cozy-accent text-white text-xs px-4 py-2 rounded-xl hover:bg-cozy-text dark:hover:bg-cozy-dark-text transition-all font-medium"
                >
                    {showForm ? t('registry.btn_cancel') : t('registry.btn_add')}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-cozy-bg/50 dark:bg-cozy-dark-bg/50 rounded-xl space-y-4 text-xs">
                    {error && <div className="text-cozy-alert font-semibold">{error}</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <input type="text" placeholder={t('registry.placeholder_name')} value={name} onChange={e => setName(e.target.value)} className="p-2 rounded-lg bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage" />
                        <input type="number" step="0.01" placeholder={t('registry.placeholder_price')} value={price} onChange={e => setPrice(e.target.value)} className="p-2 rounded-lg bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage" />
                        <input type="date" value={billingDate} onChange={e => setBillingDate(e.target.value)} className="p-2 rounded-lg bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage" />
                        <input type="text" placeholder={t('registry.placeholder_category')} value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded-lg bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage" />
                        <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} className="p-2 rounded-lg bg-cozy-card dark:bg-cozy-dark-card border border-cozy-sage">
                            <option value="WEEKLY">WEEKLY</option>
                            <option value="MONTHLY">MONTHLY</option>
                            <option value="QUARTERLY">QUARTERLY</option>
                            <option value="YEARLY">YEARLY</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-cozy-accent text-white px-4 py-2 rounded-lg font-medium">{t('registry.btn_save')}</button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                        <tr className="text-cozy-muted dark:text-cozy-dark-muted border-b border-gray-50 dark:border-cozy-dark-sage/20">
                            <th className="pb-3 font-medium">{t('registry.th_service')}</th>
                            <th className="pb-3 font-medium">{t('registry.th_timeline')}</th>
                            <th className="pb-3 font-medium">{t('registry.th_cycle')}</th>
                            <th className="pb-3 font-medium">{t('registry.th_rate')}</th>
                            <th className="pb-3 text-right font-medium">{t('registry.th_actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-cozy-muted">{t('registry.no_records')}</td>
                            </tr>
                        ) : (
                            subscriptions.map(sub => (
                                <tr key={sub.id} className="hover:bg-cozy-bg/30 dark:hover:bg-cozy-dark-bg/30 border-b border-gray-50/50 dark:border-cozy-dark-sage/10">
                                    <td className="py-4">
                                        <span className="text-sm font-semibold">{sub.name}</span>
                                        <div className="text-[10px] text-cozy-muted dark:text-cozy-dark-muted font-normal mt-0.5">{sub.category}</div>
                                    </td>
                                    <td className="py-4 text-cozy-muted dark:text-cozy-dark-muted font-normal">{t('registry.next_bill')} {sub.billingDate}</td>
                                    <td className="py-4"><span className="bg-cozy-sage/40 dark:bg-cozy-dark-sage/40 px-2 py-0.5 rounded-md text-[10px]">{sub.billingCycle}</span></td>
                                    <td className="py-4 text-sm">${Number(sub.price).toFixed(2)}</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDelete(sub.id)} className="text-cozy-alert hover:text-red-500 font-semibold px-2 py-1">
                                            {t('registry.btn_delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}