export type AppConfig = {
    native?: boolean;
    remoteAppUrl?: string | null;
    nativeError?: string | null;
    locale?: string | null;
};

export function getAppConfig(): AppConfig {
    if (typeof window === 'undefined') {
        return {};
    }

    return (window as Window & { __APP_CONFIG__?: AppConfig }).__APP_CONFIG__ ?? {};
}

export function isNativeApp(): boolean {
    return Boolean(getAppConfig().native);
}

export function getRemoteAppUrl(): string | null {
    return getAppConfig().remoteAppUrl ?? null;
}

export function getNativeError(): string | null {
    return getAppConfig().nativeError ?? null;
}

export function getAppLocale(): string | null {
    return getAppConfig().locale ?? null;
}
