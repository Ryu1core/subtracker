import React, { createContext, useState } from 'react';

export const LangContext = createContext();

const translations = {
  ru: {
    welcome: 'Добро пожаловать в уютный трекер подписок',
    nav: {
      overview: 'Обзор',
      analytics: 'Аналитика',
      logout: 'Выйти'
    },
    status: {
      active_subs: 'Активные подписки',
      pcs: 'шт.',
      all_active: 'Все подписки активны',
      monthly_exp: 'Расходы в месяц',
      exchange_rate: 'Расчёт на основе текущего курса',
      attention: 'Требуют внимания',
      charges: 'списаний',
      next_3_days: 'Ближайшие 3 дня',
      avg_cost: 'Средняя стоимость',
      per_sub: 'На одну подписку',
      loading: 'Загрузка...'
    },
    registry: {
      add_title: 'Добавить подписку',
      name_placeholder: 'Название (напр. Netflix)',
      price_placeholder: 'Цена',
      add_button: 'Добавить',
      your_subs: 'Ваши подписки',
      empty: 'У вас пока нет добавленных подписок'
    },
    debts: {
      title: 'Кто мне должен',
      per_month: 'мес',
      no_debts: 'Никто не должен'
    },
    auth: {
      welcome_back: 'С возвращением',
      create_account: 'Создать аккаунт',
      subtitle_login: 'Войдите в личный кабинет SubTrack',
      subtitle_register: 'Зарегистрируйтесь для синхронизации подписок',
      email_label: 'Email',
      password_label: 'Пароль',
      btn_loading: 'Загрузка...',
      btn_login: 'Войти',
      btn_register: 'Зарегистрироваться',
      no_account: 'Ещё нет аккаунта?',
      switch_register: 'Создать',
      has_account: 'Уже есть аккаунт?',
      switch_login: 'Войти',
      error_409: 'Пользователь с таким именем или email уже существует',
      error_400: 'Неверный логин или пароль',
      error_default: 'Ошибка подключения к серверу'
    }
  },
  en: {
    welcome: 'Welcome to your cozy subscription tracker',
    nav: {
      overview: 'Overview',
      analytics: 'Analytics',
      logout: 'Sign Out'
    },
    status: {
      active_subs: 'Active Subscriptions',
      pcs: 'pcs.',
      all_active: 'All subscriptions active',
      monthly_exp: 'Monthly Expenses',
      exchange_rate: 'Calculated at current rate',
      attention: 'Requires Attention',
      charges: 'charges',
      next_3_days: 'Next 3 days',
      avg_cost: 'Average Cost',
      per_sub: 'Per subscription',
      loading: 'Loading...'
    },
    registry: {
      add_title: 'Add Subscription',
      name_placeholder: 'Name (e.g. Netflix)',
      price_placeholder: 'Price',
      add_button: 'Add',
      your_subs: 'Your Subscriptions',
      empty: 'No subscriptions added yet'
    },
    debts: {
      title: 'Who Owes Me',
      per_month: 'mo',
      no_debts: 'Nobody owes you'
    },
    auth: {
      welcome_back: 'Welcome Back',
      create_account: 'Create Account',
      subtitle_login: 'Sign in to your SubTrack account',
      subtitle_register: 'Sign up to sync your subscriptions',
      email_label: 'Email',
      password_label: 'Password',
      btn_loading: 'Loading...',
      btn_login: 'Sign In',
      btn_register: 'Sign Up',
      no_account: "Don't have an account?",
      switch_register: 'Sign Up',
      has_account: 'Already have an account?',
      switch_login: 'Sign In',
      error_409: 'User with this username or email already exists',
      error_400: 'Invalid username or password',
      error_default: 'Server connection error'
    }
  }
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru');

  const toggleLang = () => {
    const nextLang = lang === 'ru' ? 'en' : 'ru';
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return path; // Возврат ключа при отсутствии перевода
      }
    }

    return current;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}