"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, t, TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: "pt",
    setLocale: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("pt");

    useEffect(() => {
        const saved = localStorage.getItem("vinhas-lang") as Locale | null;
        if (saved && ["pt", "en", "es", "fr"].includes(saved)) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("vinhas-lang", newLocale);
    };

    const translate = (key: TranslationKey) => t(key, locale);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t: translate }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
