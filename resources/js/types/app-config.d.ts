import type { AppConfig } from '@/lib/platform';

declare global {
    interface Window {
        __APP_CONFIG__?: AppConfig;
    }
}

export {};
