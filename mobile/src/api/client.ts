import { API_URL } from '../config';

/** `code` is the backend's error `detail` (e.g. "email_taken"), or "network" / "unknown". */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, timeoutMs = 8000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, 'network'); // offline, wrong address or timeout
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let code = 'unknown';
    try {
      const data = (await response.json()) as { detail?: unknown };
      if (typeof data.detail === 'string') code = data.detail;
    } catch {
      // body is not JSON
    }
    throw new ApiError(response.status, code);
  }
  return (await response.json()) as T;
}
