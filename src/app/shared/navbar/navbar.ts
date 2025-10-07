// src/app/shared/navbar/navbar.ts
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Auth } from '../../services/auth';
import { Api } from '../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();   // <-- NEW

  private auth = inject(Auth);
  private api = inject(Api);
  private router = inject(Router);

  userName: string | null = null;
  userLogin: string | null = null;
  avatarUrl: string | null = null;
  loggingOut = false;

  constructor() {
    this.refreshUser();
  }

  refreshUser() {
    const user = this.auth.getUser();
    this.userName = user?.NAME ?? null;
    this.userLogin = user?.INI ?? null;
    this.avatarUrl = null;
  }

  async onLogout() {
    if (this.loggingOut) return;
    this.loggingOut = true;
    try {
      await lastValueFrom(this.api.authPost('Login/logout', {}));
    } catch (err) {
      console.warn('Server logout failed', err);
    } finally {
      this.auth.clear();
      await this.router.navigate(['']);
      this.loggingOut = false;
    }
  }
}
