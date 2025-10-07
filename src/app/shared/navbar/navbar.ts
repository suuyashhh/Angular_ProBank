import { Component, inject } from '@angular/core';
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
  private auth = inject(Auth);
  private api = inject(Api);
  private router = inject(Router);

  userName: string | null = null;
  userLogin: string | null = null;
  avatarUrl: string | null = null; // you can map user picture if available
  loggingOut = false;

  constructor() {
    this.refreshUser();
  }

  refreshUser() {
    const user = this.auth.getUser();
    this.userName = user?.NAME ?? null;
    this.userLogin = user?.INI ?? null;
    // if you store avatar url in user details, map it here
    this.avatarUrl = null;
  }

  async onLogout() {
    // Prevent double click
    if (this.loggingOut) return;
    this.loggingOut = true;

    try {
      // Call server logout if token exists; swallow errors but still clear client state
      await lastValueFrom(this.api.authPost('Login/logout', {}));
    } catch (err) {
      // If server logout fails (token invalid/expired), continue to clear client side anyway
      console.warn('Server logout failed (continuing to clear client)', err);
    } finally {
      // Clear client storage and redirect to login route (root)
      this.auth.clear();
      // If your login route is '', navigate there
      await this.router.navigate(['']);
      this.loggingOut = false;
    }
  }
}
