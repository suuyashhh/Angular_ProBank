import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";

export const UserMaster_Routes: Routes = [
  {
    path: '',
    redirectTo:'dashboard',
    pathMatch:"full"   
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  }
];
