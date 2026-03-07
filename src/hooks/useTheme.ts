import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('novaris-theme');
        if (stored === 'light' || stored === 'dark') return stored;
        // Default to light
        return 'light';
    });

    useEffect(() => {
        // Design system uses .dark class on <html> (Tailwind v4 class strategy)
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('novaris-theme', theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return { theme, toggle };
}
