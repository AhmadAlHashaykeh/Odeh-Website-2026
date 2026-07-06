const TOKEN_STORAGE_KEY = 'odeh_auth_token';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new ApiError('VITE_API_BASE_URL is not configured.', 0);
  }

  return baseUrl.replace(/\/$/, '');
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
}

async function parseJsonBody(response: Response): Promise<Record<string, unknown> | null> {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    return null;
  }

  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getErrorMessage(body: Record<string, unknown> | null, fallback: string): string {
  if (body && typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  return fallback;
}

function getValidationErrors(
  body: Record<string, unknown> | null,
): Record<string, string[]> | undefined {
  if (!body || typeof body.errors !== 'object' || body.errors === null) {
    return undefined;
  }

  const errors: Record<string, string[]> = {};

  for (const [field, value] of Object.entries(body.errors)) {
    if (Array.isArray(value)) {
      errors[field] = value.map(String);
    } else if (typeof value === 'string') {
      errors[field] = [value];
    }
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const body = await parseJsonBody(response);

  if (response.status === 401) {
    unauthorizedHandler?.();
    throw new ApiError(getErrorMessage(body, 'Unauthorized'), 401, getValidationErrors(body));
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(body, `Request failed with status ${response.status}`),
      response.status,
      getValidationErrors(body),
    );
  }

  return body as T;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  headers.set('Accept', 'application/json');

  if (auth) {
    const token = getStoredToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers,
    body: requestBody,
  });

  return handleResponse<T>(response);
}

export const apiClient = {
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: Omit<ApiRequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },

  postMultipart<T>(
    path: string,
    formData: FormData,
    options?: Omit<ApiRequestOptions, 'body'>,
  ): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body: formData });
  },
};
