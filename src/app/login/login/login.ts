import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
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

  async submit() {
    console.log('hi');
    this.serverError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      INI: this.form.value.INI?.trim(),
      CODE: this.form.value.CODE
    };

    this.loading = true;
    try {
      // Controller endpoint: POST api/Login/authenticate
      const res: any = await this.api.post('Login/authenticate', payload).toPromise();
      console.log(res);
      // Expect { token, expires, userDetails }
      if (res && res.token) {
        this.auth.setToken(res.token, res.expires, res.userDetails);
        // navigate to home/dashboard
        await this.router.navigate(['/USERMASTER']); // change route as appropriate
      } else {
        this.serverError = 'Invalid server response';
      }
    } catch (err: any) {
      // handle 400/401/500
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
