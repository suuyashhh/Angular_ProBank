import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path:'',
        component:Login
    },
    {
        path:'USERMASTER',
        loadComponent:()=> import('./Components/usermaster/landing/landing').then(m => m.Landing),
        loadChildren:()=> import('./Components/usermaster/usermaster.routes').then(m=> m.UserMaster_Routes),
        canActivate:[authGuard],
        
    }
];
