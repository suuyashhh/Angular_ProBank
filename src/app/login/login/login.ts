import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private auth = inject(Auth);
  private router = inject(Router);

  loading = false;
  serverError: string | null = null;

  form = this.fb.group({
    INI: ['', [Validators.required]],
    CODE: ['', [Validators.required]]
  });

  // optional: toggle password visibility (if you want to implement)
  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
    const el = document.getElementById('password') as HTMLInputElement | null;
    if (el) el.type = this.showPassword ? 'text' : 'password';
  }

  async submit() {
    // clear previous error
    this.serverError = null;

    // guard invalid
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      INI: (this.form.value.INI || '').toString().trim(),
      CODE: this.form.value.CODE
    };

    this.loading = true;
  this.form.disable();

    try {
      // API path: POST api/Login/authenticate
      // Use lastValueFrom to await the observable
      const res: any = await lastValueFrom(this.api.post('Login/authenticate', payload));

      // Expect { token, expires, userDetails }
      if (res && res.token) {
        this.auth.setToken(res.token, res.expires, res.userDetails);
        // navigate to home/dashboard
        await this.router.navigate(['/USERMASTER']);
      } else {
        this.serverError = 'Invalid server response';
      }
    } catch (err: any) {
      console.error('Login error', err);
      if (err?.status === 401) {
        this.serverError = 'Invalid credentials';
      } else if (err?.error?.message) {
        this.serverError = err.error.message;
      } else {
        this.serverError = 'Server error. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
