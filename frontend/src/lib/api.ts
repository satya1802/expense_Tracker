/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails --
// which `vite build` does not catch, because it tree-shakes this module out when no screen
// imports it yet.
//
// Where the generated API lives.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build. The
// fallback is the local backend so a bare `npm run dev` still points somewhere real.
//
// The generated screens do NOT use this yet -- they render seeded sample data, exactly as
// they were approved. This is the seam to replace that with real calls, one screen at a
// time.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// The shared bearer the deployed API expects (its SECRET_KEY). The platform bakes the
// same value into both sides at deploy time, so authenticated calls work out of the box.
export const API_SECRET_KEY: string = import.meta.env.VITE_API_SECRET_KEY ?? "";

// The frontend and the API are on different origins once deployed, so a login flow
// cannot rely on a cookie coming back (a browser drops a cross-origin cookie unless every
// attribute is exactly right, and that keeps getting stricter regardless). A ticket that
// implements login reads `/auth/login`'s token from its response body and calls
// `setSessionToken` with it; apiFetch then sends it as the bearer on every later call,
// ahead of the shared secret.
const SESSION_TOKEN_KEY = "session_token";

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode, quota): the session just won't persist.
  }
}

export function clearSessionToken(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Nothing to clear if storage was never reachable.
  }
}

// Thrown by apiFetch for any non-2xx response. `status` and the parsed JSON `body`
// (when the response had one) let a screen tell a 409 from a 422 from a 401 apart
// and show the right per-field or generic message, instead of guessing from a
// stringified message.
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`request failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Set by the app shell once, on mount: called whenever a non-auth endpoint answers
// 401 (missing, malformed, revoked or idle-expired token). apiFetch itself has no
// router access, so it clears the token and leaves the redirect + notice to the
// handler the app registers.
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const bearer = getSessionToken() ?? API_SECRET_KEY;
  // Join with exactly one slash: API_BASE_URL is baked with a trailing slash (the API
  // sits behind a /apps/<slug>/ path prefix) and paths start with "/", so a naive
  // concat yields "...//auth/me", which a path-prefix proxy need not route.
  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // No JSON body (or an empty one) to report.
    }
    // /auth/login and /auth/signup answer 401/409/422 as ordinary business
    // outcomes the screen itself must show; only a 401 from every other
    // (bearer-protected) endpoint means the session itself is no longer valid.
    if (response.status === 401 && !path.startsWith("/auth/")) {
      clearSessionToken();
      unauthorizedHandler?.();
    }
    throw new ApiError(response.status, body);
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
