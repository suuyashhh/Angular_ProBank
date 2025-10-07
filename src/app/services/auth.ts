// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UserDetails {
  INI?: string;
  LOGIN_IP?: string;
  NAME?: string;
  AUTHORITY?: string;
  ACTIVATE?: string;
  [k: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly TOKEN_KEY = 'app_token';
  private readonly TOKEN_EXPIRES = 'app_token_expires';
  private readonly USER_KEY = 'app_user';

  constructor(private router: Router) {}

  setToken(token: string, expiresIsoOrDate: string | Date, userDetails?: UserDetails) {
    localStorage.setItem(this.TOKEN_KEY, token);
    // store expires as ISO string
    const iso = (expiresIsoOrDate instanceof Date) ? expiresIsoOrDate.toISOString() : (expiresIsoOrDate ?? '');
    localStorage.setItem(this.TOKEN_EXPIRES, iso);
    if (userDetails) localStorage.setItem(this.USER_KEY, JSON.stringify(userDetails));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): UserDetails | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRES);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(redirect = true) {
    this.clear();
    if (redirect) this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem(this.TOKEN_EXPIRES);
    if (!exp) return true;
    const dt = new Date(exp);
    return dt.getTime() <= Date.now();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // quick expiry check using stored expiry
    if (this.isTokenExpired()) return false;

    // optionally verify JTI or remote validation (not implemented client-side)
    return true;
  }

  // helpful: decode payload (base64) to read claims if needed
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

  // convenience getters
  getUserName(): string | null {
    const u = this.getUser();
    return u?.NAME ?? null;
  }
}
