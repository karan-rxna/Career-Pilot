// ---------------------------------------------------------------------------
// CareerPilot API client.
//
// Two deliberate choices worth knowing:
//  * native fetch rather than axios — the project ships no HTTP dependency and
//    this needs none. The interceptor behaviour that actually matters (rotate
//    once on a 401, then replay the request) is implemented below.
//  * the access token is held in memory only, never localStorage. The refresh
//    token is an httpOnly cookie the browser sends for us, which is why a page
//    reload restores the session through POST /api/auth/refresh instead of
//    reading a stored credential an XSS payload could steal.
// ---------------------------------------------------------------------------

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";

/** Base URL of the Spring API, trailing slash removed. */
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

/** Mirrors the backend's UserResponse record. */
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  handle: string | null;
  college: string | null;
  batch: string | null;
  location: string | null;
  headline: string | null;
  bio: string | null;
  avatarHue: number;
  readinessScore: number;
  resumeProgress: number;
  skills: string[];
  role: string;
  joinedOn: string;
}

export interface AuthResult {
  accessToken: string;
  expiresIn: number;
  user: ApiUser;
}

export interface RefreshResult {
  accessToken: string;
  expiresIn: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  college?: string;
}

/** PATCH /api/users/me — every field optional, only what you send is applied. */
export interface ProfileUpdate {
  name?: string;
  handle?: string;
  college?: string;
  batch?: string;
  location?: string;
  headline?: string;
  bio?: string;
  avatarHue?: number;
  skills?: string[];
}

/**
 * Every API failure, normalised from the backend's ApiError envelope
 * ({ status, error, message, path, timestamp, fieldErrors }).
 * `status === 0` means the request never left the browser — API unreachable.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, code: string, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  get isOffline(): boolean {
    return this.status === 0;
  }

  /** The first field the server rejected — handy for inline form errors. */
  get firstFieldError(): string | undefined {
    return Object.values(this.fieldErrors)[0];
  }
}

/** Fired when a refresh attempt proves the session is gone (cookie revoked/expired). */
export const SESSION_LOST_EVENT = "careerpilot:session-lost";

// --- access token + refresh -------------------------------------------------

let accessToken: string | null = null;
let refreshInFlight: Promise<string> | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Rotates the refresh cookie and stores the new access token.
 *
 * Concurrent callers share a single request: the backend revokes each refresh
 * token the moment it is used, so two parallel rotations would invalidate one
 * another and sign the user out.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = authApi
      .refresh()
      .then((result) => {
        accessToken = result.accessToken;
        return result.accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

// --- core request -----------------------------------------------------------

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the bearer token. Auth endpoints pass false. */
  auth?: boolean;
  /** Allow the one-time refresh-and-replay on a 401. */
  retry?: boolean;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, retry = true, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include", // carries the httpOnly refresh cookie
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    // Also the landing spot for a CORS rejection, which surfaces as a bare TypeError.
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      `Can't reach the API at ${API_BASE}. Check the backend is running, and that this page's origin (${window.location.origin}) is in its CORS_ALLOWED_ORIGINS.`
    );
  }

  // Access token expired mid-session: rotate once, then replay the request.
  if (response.status === 401 && auth && retry) {
    const recovered = await refreshAccessToken().then(
      () => true,
      () => false
    );
    if (recovered) return request<T>(path, { ...options, retry: false });

    // The refresh cookie is gone too — this session is over.
    setAccessToken(null);
    if (typeof window !== "undefined") window.dispatchEvent(new Event(SESSION_LOST_EVENT));
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as {
      error?: string;
      message?: string;
      fieldErrors?: Record<string, string>;
    };
    return new ApiError(
      response.status,
      body.error ?? "ERROR",
      body.message ?? response.statusText,
      body.fieldErrors ?? {}
    );
  } catch {
    return new ApiError(response.status, "ERROR", response.statusText || `Request failed (${response.status})`);
  }
}

// --- endpoints --------------------------------------------------------------

export const authApi = {
  register: (input: RegisterInput) =>
    request<AuthResult>("/api/auth/register", { method: "POST", body: input, auth: false, retry: false }),

  login: (input: { email: string; password: string }) =>
    request<AuthResult>("/api/auth/login", { method: "POST", body: input, auth: false, retry: false }),

  refresh: () => request<RefreshResult>("/api/auth/refresh", { method: "POST", auth: false, retry: false }),

  logout: () => request<void>("/api/auth/logout", { method: "POST", auth: false, retry: false }),

  forgot: (email: string) =>
    request<void>("/api/auth/forgot", { method: "POST", body: { email }, auth: false, retry: false }),

  /** The backend's ResetRequest field is `newPassword`, so map it here rather than at the call site. */
  reset: (input: { token: string; password: string }) =>
    request<void>("/api/auth/reset", {
      method: "POST",
      body: { token: input.token, newPassword: input.password },
      auth: false,
      retry: false,
    }),
};

export const usersApi = {
  me: () => request<ApiUser>("/api/users/me"),
  updateMe: (patch: ProfileUpdate) => request<ApiUser>("/api/users/me", { method: "PATCH", body: patch }),
};
