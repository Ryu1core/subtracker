import React, { createContext, useState } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export const LangContext = createContext();

const locales = { en, ru };

export function LangProvider({ children }) {
    const [lang, setLang] = useState('en');

    const t = (path) => {
        const keys = path.split('.');
        let current = locales[lang];

        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                return path;
            }
        }
        return current;
    };

    const toggleLang = () => setLang((prev) => (prev === 'ru' ? 'en' : 'ru'));

    return (
        <LangContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LangContext.Provider>
    );
}