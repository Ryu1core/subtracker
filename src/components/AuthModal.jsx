import React, { useState, useContext } from 'react';
import { LangContext } from '../context/LangContext';
import { authApi } from '../services/api';

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { lang, t } = useContext(LangContext);

  const isRu = lang === 'ru';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await authApi.login({
          username: formData.username,
          password: formData.password
        });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        } else if (typeof res === 'string') {
          localStorage.setItem('token', res);
        }
      } else {
        const res = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      }
      onSuccess();
    } catch (err) {
      if (err.status === 409) {
        setError(t('auth.error_409'));
      } else if (err.status === 400) {
        setError(t('auth.error_400'));
      } else {
        setError(err.message || t('auth.error_default'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-cozy-card dark:bg-cozy-dark-card border border-cozy-border dark:border-cozy-dark-border text-cozy-text dark:text-cozy-dark-text p-8 rounded-cozy max-w-md w-full relative shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-cozy-muted dark:text-cozy-dark-muted hover:text-cozy-text dark:hover:text-cozy-dark-text text-xl cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-1">
            {mode === 'login' ? t('auth.welcome_back') : t('auth.create_account')}
          </h2>
          <p className="text-xs text-cozy-muted dark:text-cozy-dark-muted">
            {mode === 'login' ? t('auth.subtitle_login') : t('auth.subtitle_register')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-cozy-alert/15 border border-cozy-alert/30 text-cozy-alert text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted mb-1">
              {isRu ? 'Логин' : 'Username'}
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-cozy-bg dark:bg-cozy-dark-bg border border-cozy-border dark:border-cozy-dark-border focus:outline-none focus:border-cozy-accent text-sm transition-all"
              placeholder="yatokura"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted mb-1">
                {t('auth.email_label')}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cozy-bg dark:bg-cozy-dark-bg border border-cozy-border dark:border-cozy-dark-border focus:outline-none focus:border-cozy-accent text-sm transition-all"
                placeholder="user@subtrack.app"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-cozy-muted dark:text-cozy-dark-muted mb-1">
              {t('auth.password_label')}
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-cozy-bg dark:bg-cozy-dark-bg border border-cozy-border dark:border-cozy-dark-border focus:outline-none focus:border-cozy-accent text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-cozy-accent text-white font-medium text-sm hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? t('auth.btn_loading') : mode === 'login' ? t('auth.btn_login') : t('auth.btn_register')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-cozy-muted dark:text-cozy-dark-muted">
          {mode === 'login' ? (
            <p>
              {t('auth.no_account')}{' '}
              <button
                onClick={() => { setError(''); setMode('register'); }}
                className="text-cozy-accent font-semibold hover:underline cursor-pointer"
              >
                {t('auth.switch_register')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.has_account')}{' '}
              <button
                onClick={() => { setError(''); setMode('login'); }}
                className="text-cozy-accent font-semibold hover:underline cursor-pointer"
              >
                {t('auth.switch_login')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}