import { isNativeApp } from '@/lib/platform';

type LocalNotification = {
  title: string;
  body?: string;
};

let initialized = false;

async function importNativePhp(): Promise<any | null> {
  if (!isNativeApp()) {
    return null;
  }

  try {
    // Prevent Vite from trying to resolve "#nativephp" at build time.
    // eslint-disable-next-line no-new-func
    const importer = new Function('return import("#nativephp")');
    return await importer();
  } catch {
    return null;
  }
}

export async function initializeNotifications() {
  if (initialized) {
    return;
  }

  initialized = true;

  if (!isNativeApp()) {
    return;
  }

  const module = await importNativePhp();
  const push = module?.pushNotifications;

  if (!push) {
    return;
  }

  try {
    if (push?.enroll) {
      await push.enroll();
    }

    if (push?.on) {
      push.on('TokenGenerated', (token: string) => {
        window.dispatchEvent(new CustomEvent('native:push-token', { detail: token }));
      });

      push.on('NotificationReceived', (payload: { title?: string; body?: string }) => {
        notifyLocal({
          title: payload.title ?? 'Update',
          body: payload.body ?? '',
        });
      });
    }
  } catch {
    // Keep silent; fall back to in-app notifications.
  }
}

export function notifyLocal(payload: LocalNotification) {
  if (typeof window === 'undefined') {
    return;
  }

  // Native desktop/mobile local notifications (best-effort)
  if (isNativeApp() && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(payload.title, { body: payload.body ?? '' });
    return;
  }

  // Web + fallback
  window.dispatchEvent(new CustomEvent('app:notify', { detail: payload }));
}
