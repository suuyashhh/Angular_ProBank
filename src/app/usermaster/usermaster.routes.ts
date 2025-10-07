import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";

export const UserMaster_Routes: Routes = [
  {
    path: '',
    component: Dashboard   
  },
  {
    path: 'dashboard',
    component: Dashboard
  }
];
