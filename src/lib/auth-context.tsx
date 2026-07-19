"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  googleLogin,
  logoutRequest,
  refreshAccessToken,
  type BackendUser,
} from "@/lib/api-client";
import { clearPreferredSize } from "@/lib/preferred-size";

export interface AuthUser {
  id?: number;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  hasBackendSession: boolean;
  signUp: (data: AuthUser) => void;
  logIn: (phone: string) => void;
  loginWithGoogle: (idToken: string) => Promise<void>;
  refreshSession: () => Promise<string>;
  logOut: () => void;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCOUNT_KEY = "arborn_account";
const SESSION_KEY = "arborn_session";
const ACCESS_TOKEN_KEY = "arborn_access_token";
const REFRESH_TOKEN_KEY = "arborn_refresh_token";

function userFromBackend(backendUser: BackendUser): AuthUser {
  const firstName = backendUser.first_name ?? backendUser.name?.split(" ")[0] ?? "";
  const lastName =
    backendUser.last_name ?? backendUser.name?.split(" ").slice(1).join(" ") ?? "";
  return {
    id: backendUser.id,
    name: backendUser.name || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    email: backendUser.email,
    phone: "",
    avatar: backendUser.profile_image,
  };
}

// NOTE: signUp/logIn (phone + password) remain a mock, frontend-only flow
// with no real backend check. loginWithGoogle is the real path via
// POST /accounts/v1/auth/google/.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
      const access = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (access) setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
    } catch {
      // ignore malformed localStorage data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (accessToken && refreshToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [accessToken, refreshToken, hydrated]);

  function signUp(data: AuthUser) {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
    setUser(data);
  }

  function logIn(phone: string) {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      const account: AuthUser | null = raw ? JSON.parse(raw) : null;
      setUser(account ?? { name: "Member", phone, email: "" });
    } catch {
      setUser({ name: "Member", phone, email: "" });
    }
  }

  async function loginWithGoogle(idToken: string) {
    const data = await googleLogin(idToken);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    setUser(userFromBackend(data.user));
  }

  async function refreshSession() {
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const data = await refreshAccessToken(refreshToken);
    setAccessToken(data.access_token);
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
    }
    return data.access_token;
  }

  function logOut() {
    // Best-effort — the user is logged out locally regardless of whether
    // this call succeeds (backend may be unreachable, token may already be
    // expired, etc).
    if (accessToken && refreshToken) {
      logoutRequest(accessToken, refreshToken).catch(() => {});
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearPreferredSize();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        accessToken,
        hasBackendSession: !!accessToken,
        signUp,
        logIn,
        loginWithGoogle,
        refreshSession,
        logOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
