import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: '../modules/registration/registration.module#RegistrationModule'
  }
];
