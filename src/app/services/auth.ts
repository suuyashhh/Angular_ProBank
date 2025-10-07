// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UserDetails { 
    NAME?: string;
  INI?: string;
  LOGIN_IP?: string;
  AUTHORITY?: string;
  ACTIVATE?: string;
  [k: string]: any; // keep if you still need arbitrary keys
 }

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly TOKEN_KEY = 'app_token';
  private readonly TOKEN_EXPIRES = 'app_token_expires';
  private readonly USER_KEY = 'app_user';

  constructor(private router: Router) {}

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setToken(token: string, expiresIsoOrDate: string | Date, userDetails?: UserDetails) {
    if (!this.hasStorage()) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    const iso = (expiresIsoOrDate instanceof Date) ? expiresIsoOrDate.toISOString() : (expiresIsoOrDate ?? '');
    localStorage.setItem(this.TOKEN_EXPIRES, iso);
    if (userDetails) localStorage.setItem(this.USER_KEY, JSON.stringify(userDetails));
  }

  getToken(): string | null {
    if (!this.hasStorage()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): UserDetails | null {
    if (!this.hasStorage()) return null;
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clear() {
    if (!this.hasStorage()) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRES);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(redirect = true) {
    this.clear();
    if (redirect) this.router.navigate(['/']); // navigate to login route (root)
  }

  isTokenExpired(): boolean {
    if (!this.hasStorage()) return true; // consider expired on server
    const exp = localStorage.getItem(this.TOKEN_EXPIRES);
    if (!exp) return true;
    const dt = new Date(exp);
    return dt.getTime() <= Date.now();
  }

  isAuthenticated(): boolean {
    // Always safe to call on server; return false (not authenticated) when no storage
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired()) return false;
    return true;
  }

  decodePayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(payload)));
    } catch {
      return null;
    }
  }

  getUserName(): string | null {
    const u = this.getUser();
    return u?.NAME ?? null;
  }
}
