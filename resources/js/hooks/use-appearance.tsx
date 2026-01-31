import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
};

const forceLight = () => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('appearance', 'light');
    }

    setCookie('appearance', 'light');
};

export function initializeTheme() {
    forceLight();
    applyTheme();
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((_mode: Appearance) => {
        setAppearance('light');
        forceLight();
        applyTheme();
    }, []);

    useEffect(() => {
        updateAppearance('light');
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
