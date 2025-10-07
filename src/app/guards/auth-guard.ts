// src/app/guards/auth-guard.ts
import { CanActivateFn, Router,  } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Not authenticated -> redirect to login (include returnUrl)
  router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
};
