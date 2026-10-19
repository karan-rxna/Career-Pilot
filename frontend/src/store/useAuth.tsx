import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SESSION_LOST_EVENT,
  authApi,
  refreshAccessToken,
  setAccessToken,
  usersApi,
  type ApiUser,
  type AuthResult,
  type ProfileUpdate,
  type RegisterInput,
} from "../lib/api";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: ProfileUpdate) => Promise<void>;
  /** Re-reads the profile — call after anything changes it server-side. */
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<ApiUser | null>(null);

  const apply = useCallback((result: AuthResult) => {
    setAccessToken(result.accessToken);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const clear = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  /**
   * Session bootstrap. The access token died with the page, but the httpOnly
   * refresh cookie did not — rotate it once, then read the profile.
   *
   * React 19 StrictMode runs effects twice in development; the refresh is
   * single-flighted inside the API client, so this stays one request and the
   * state it sets is idempotent.
   */
  const reload = useCallback(async () => {
    try {
      await refreshAccessToken();
      const me = await usersApi.me();
      setUser(me);
      setStatus("authenticated");
    } catch {
      clear();
    }
  }, [clear]);

  // StrictMode mounts effects twice in development; the ref keeps that to a single
  // bootstrap request. It survives the remount because the instance does.
  const bootstrapped = useRef<Promise<void> | null>(null);
  useEffect(() => {
    bootstrapped.current ??= reload();
  }, [reload]);

  // A password reset elsewhere, or a logout in another tab, kills the cookie.
  useEffect(() => {
    const onLost = () => clear();
    window.addEventListener(SESSION_LOST_EVENT, onLost);
    return () => window.removeEventListener(SESSION_LOST_EVENT, onLost);
  }, [clear]);

  const login = useCallback(
    async (email: string, password: string) => {
      apply(await authApi.login({ email: email.trim().toLowerCase(), password }));
    },
    [apply]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      apply(await authApi.register({ ...input, email: input.email.trim().toLowerCase() }));
    },
    [apply]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Best effort: the cookie may already be gone. Local state is cleared regardless.
    }
    clear();
  }, [clear]);

  const updateProfile = useCallback(async (patch: ProfileUpdate) => {
    setUser(await usersApi.updateMe(patch));
  }, []);

  const refreshUser = useCallback(async () => {
    setUser(await usersApi.me());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout, updateProfile, refreshUser }),
    [status, user, login, register, logout, updateProfile, refreshUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
