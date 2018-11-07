import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/_auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: '../modules/landing/landing.module#LandingModule'
  },
  {
    path: 'registration',
    // canActivate: [AuthGuard],
    loadChildren: '../modules/registration/registration.module#RegistrationModule'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
