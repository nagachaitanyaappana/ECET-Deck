const DEFAULT_API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function getApiBaseUrl(): string {
  const saved = localStorage.getItem('ecet_api_base_url');
  if (saved) return saved.replace(/\/+$/, '');
  if (DEFAULT_API_BASE) return DEFAULT_API_BASE;
  const isCapacitor = typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor.isNativePlatform();
  if (isCapacitor) {
    // In Android emulator, 10.0.2.2 points to host machine localhost
    return 'http://10.0.2.2:8080';
  }
  return '';
}

export function setApiBaseUrl(url: string): void {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed) {
    localStorage.setItem('ecet_api_base_url', trimmed);
  } else {
    localStorage.removeItem('ecet_api_base_url');
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const base = getApiBaseUrl();
  const url = `${base}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    let data = null;
    try {
      data = await response.json();
      errorMsg = data.message || data.error || errorMsg;
    } catch {
      errorMsg = await response.text() || errorMsg;
    }
    throw new ApiError(response.status, errorMsg, data);
  }

  // Handle 204 or empty response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return {} as T;
}
