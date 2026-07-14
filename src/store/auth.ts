"use client";

import { create } from "zustand";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "AGENT" | "PROPERTY_MANAGER" | "MARKETING";
  agentId?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  hydrated: boolean;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  hydrated: false,
  fetchMe: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        set({ user: null, hydrated: true });
        return;
      }
      const data = await res.json();
      set({ user: data.user ?? null, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ loading: false });
        return { ok: false, error: data.error || "Login failed" };
      }
      set({ user: data.user, loading: false, hydrated: true });
      return { ok: true };
    } catch {
      set({ loading: false });
      return { ok: false, error: "Network error" };
    }
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // non-fatal — proceed with client-side clear
    }
    // Reset fully so re-login triggers a fresh fetchMe / login flow
    set({ user: null, hydrated: false, loading: false });
  },
}));
