import { apiGet, apiPost } from '@/lib/api-client';
import { clearAuthToken, setAuthToken } from '@/lib/native-storage';

type LoginResponse = {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role?: string | null;
        status?: string | null;
    };
};

export async function login(email: string, password: string, deviceName?: string) {
    const response = await apiPost<LoginResponse>('/api/native/auth/login', {
        email,
        password,
        device_name: deviceName,
    });

    await setAuthToken(response.token);
    return response.user;
}

export async function logout() {
    try {
        await apiPost('/api/native/auth/logout', {});
    } finally {
        await clearAuthToken();
    }
}

export async function fetchMe() {
    const response = await apiGet<{ user: LoginResponse['user'] }>('/api/native/auth/me');
    return response.user;
}
