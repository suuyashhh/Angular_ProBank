import { Routes } from '@angular/router';
import { Login } from './login/login/login';

export const routes: Routes = [
    {
        path:'',
        component:Login
    },
    {
        path:'USERMASTER',
        loadComponent:()=> import('./usermaster/landing/landing').then(m => m.Landing),
        loadChildren:()=> import('./usermaster/usermaster.routes').then(m=> m.UserMaster_Routes)
    }
];
