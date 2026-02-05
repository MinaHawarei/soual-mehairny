import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { initializeNotifications } from './lib/notifications';

const appName = 'سؤال محيرني';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        if (typeof window !== 'undefined') {
            const initialProps = (props.initialPage?.props ?? {}) as {
                native?: boolean;
                remoteAppUrl?: string | null;
                nativeError?: string | null;
                locale?: string | null;
            };

            window.__APP_CONFIG__ = {
                native: Boolean(initialProps.native),
                remoteAppUrl: initialProps.remoteAppUrl ?? null,
                nativeError: initialProps.nativeError ?? null,
                locale: initialProps.locale ?? null,
            };
        }

        root.render(<App {...props} />);

        initializeNotifications();
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
