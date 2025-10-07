// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UserDetails {
  INI?: string;
  LOGIN_IP?: string;
  NAME?: string;      // declared so dot-access works
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

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setToken(token: string, expiresIsoOrDate: string | Date, userDetails?: any) {
    if (!this.hasStorage()) return;

    localStorage.setItem(this.TOKEN_KEY, token);
    const iso = (expiresIsoOrDate instanceof Date) ? expiresIsoOrDate.toISOString() : (expiresIsoOrDate ?? '');
    localStorage.setItem(this.TOKEN_EXPIRES, iso);

    if (userDetails) {
      // Minimal normalization: ensure NAME exists (map server `name` to client `NAME`)
      const normalized: UserDetails = {
        ...userDetails,
        NAME: (userDetails.NAME ?? userDetails.name ?? null)
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(normalized));
    }
  }

  getToken(): string | null {
    if (!this.hasStorage()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): UserDetails | null {
    if (!this.hasStorage()) return null;
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as UserDetails : null;
  }

  clear() {
    if (!this.hasStorage()) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRES);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(redirect = true) {
    this.clear();
    if (redirect) this.router.navigate(['']);
  }

  isTokenExpired(): boolean {
    if (!this.hasStorage()) return true;
    const exp = localStorage.getItem(this.TOKEN_EXPIRES);
    if (!exp) return true;
    const dt = new Date(exp);
    return dt.getTime() <= Date.now();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired()) return false;
    return true;
  }

  getUserName(): string | null {
    const u = this.getUser();
    return u?.NAME ?? null; // simple dot-access as you requested
  }
}
