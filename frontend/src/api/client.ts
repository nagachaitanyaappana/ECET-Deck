const API_BASE = import.meta.env.VITE_API_URL || '';

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
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
