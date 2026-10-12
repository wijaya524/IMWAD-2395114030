import { computeHmacSha256 } from './crypto';
import { authStorage } from './auth';

export type ModuleType =
  | 'WAKE_UP'
  | 'BATHING'
  | 'BRUSHING_TEETH'
  | 'WEARING_UNIFORM'
  | 'PREPARING_BOOKS'
  | 'BREAKFAST'
  | 'FAREWELL';

export type DirectiveType =
  | 'NONE'
  | 'GENERAL_HINT'
  | 'SPECIFIC_VISUAL_CUE'
  | 'FALLBACK_STATIC';

export interface AdaptiveHint {
  confidence_score: number;
  directive_type: DirectiveType;
  is_fallback: boolean;
  execution_time_ms: number;
}

export interface InteractionLogItem {
  module_type: ModuleType;
  selected_object_id: string;
  is_correct: boolean;
  attempt_index: number;
  timestamp: string;
  ai_hint?: AdaptiveHint;
}

export interface SessionSyncPayload {
  session_id: string;
  device_pseudo_id: string;
  started_at: string;
  completed_at: string | null;
  is_completed: boolean;
  interactions: InteractionLogItem[];
}

export interface ApiResponse<T = any> {
  status: 'SUCCESS' | 'ERROR';
  message?: string;
  error_code?: string;
  data?: T;
}

const BACKEND_BASE = '/api/proxy';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_BASE}/auth/login`, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
    });
    // Jika merespon (meskipun 405 atau 400), berarti server backend aktif
    return res.status < 500;
  } catch {
    return false;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BACKEND_BASE}${endpoint}`;
  const token = authStorage.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({
      status: 'ERROR',
      message: `HTTP Error ${res.status}: ${res.statusText}`,
    }));

    if (!res.ok && res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      // Coba refresh token
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        const refreshed = await api.auth.refresh(refreshToken);
        if (refreshed.status === 'SUCCESS' && refreshed.data) {
          authStorage.setAuth(refreshed.data, authStorage.getUser()!);
          headers['Authorization'] = `Bearer ${refreshed.data.accessToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          return await retryRes.json();
        }
      }
    }

    return data;
  } catch (err: any) {
    return {
      status: 'ERROR',
      error_code: 'ERR_NETWORK_DISCONNECTED',
      message: err.message || 'Gagal menghubungi backend API',
    };
  }
}

export const api = {
  auth: {
    async login(email: string, password: string) {
      return request<{
        user: { id: string; email: string; name: string; role: string };
        tokens: { accessToken: string; refreshToken: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async signup(name: string, email: string, password: string, role: string = 'TEACHER') {
      return request<{
        id: string;
        email: string;
        name: string;
        role: string;
      }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
    },

    async me() {
      return request<{
        id: string;
        email: string;
        name: string;
        role: string;
      }>('/auth/me', {
        method: 'GET',
      });
    },

    async refresh(refreshToken: string) {
      return request<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    },
  },

  telemetry: {
    async syncSession(payload: SessionSyncPayload) {
      const rawBody = JSON.stringify(payload);
      const secret = process.env.NEXT_PUBLIC_DEVICE_SECRET || 'telemetry_device_secret_salt_key';
      const signature = await computeHmacSha256(rawBody, secret);
      const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

      return request<{
        session_id: string;
        synced_records_count: number;
        ingested_at: string;
      }>('/telemetry/sessions', {
        method: 'POST',
        headers: {
          'X-App-Version': version,
          'X-Device-Signature': signature,
        },
        body: rawBody,
      });
    },

    async getSession(sessionId: string, devicePseudoId: string) {
      return request<any>(`/telemetry/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'X-Device-Id': devicePseudoId,
        },
      });
    },
  },

  ai: {
    async predict(params: {
      moduleType: ModuleType;
      attemptIndex: number;
      idleTimeMs: number;
      consecutiveFailures: number;
      isDistractorClicked: boolean | number;
    }) {
      return request<{
        directive_type: DirectiveType;
        confidence_score: number;
        is_fallback: boolean;
        execution_time_ms: number;
        explanation_rules: string[];
      }>('/ai/predict', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  },
};
