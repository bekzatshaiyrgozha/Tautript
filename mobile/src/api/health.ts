import { API_URL } from '../config';

export type Health = {
  status: 'ok';
  version: string;
};

/** GET /health — throws if the server is down, slow (timeout) or returns non-200. */
export async function getHealth(timeoutMs = 5000): Promise<Health> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_URL}/health`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as Health;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout (${timeoutMs / 1000} s)`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
