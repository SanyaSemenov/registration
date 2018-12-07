import { Routes } from '@angular/router';
import { DecodeResolver, TokenResolver } from 'src/resolvers';

import { AuthGuard } from '../_auth/auth.guard';
import { MainComponent } from './components';


export const routes: Routes = [
  // {
  //   path: 'registration/step1', component: RegStep1Component
  // },
  // {
  //   path: 'registration/step2', component: RegStep2Component
  // },
  // {
  //   path: 'registration/step3', component: RegStep3Component
  // },
  // {
  //   path: '',
  //   redirectTo: 'step1',
  //   pathMatch: 'full'
  // },
  {
    path: 'registration/:token',
    component: MainComponent,
    resolve: {
      token: TokenResolver,
      decoded: DecodeResolver
    }
  },
  {
    path: 'registration',
    component: MainComponent,
    canActivate: [AuthGuard]
  }
];
