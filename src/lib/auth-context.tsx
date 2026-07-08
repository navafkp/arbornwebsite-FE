"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  name: string;
  phone: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  signUp: (data: AuthUser) => void;
  logIn: (phone: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCOUNT_KEY = "arborn_account";
const SESSION_KEY = "arborn_session";

// NOTE: this is a mock, frontend-only auth flow with no real password check
// or backend — see conversation notes. Do not treat this as secure. Real
// login needs a backend or managed auth provider (e.g. Supabase Auth).
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
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

  function logOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
