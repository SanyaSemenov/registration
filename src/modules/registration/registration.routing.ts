import { Routes } from '@angular/router';
import { RegStep1Component, RegStep2Component, RegStep3Component, MainComponent } from './components';
import { TokenResolver } from 'src/resolvers/token.resolver';
import { AuthGuard } from '../_auth/auth.guard';


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
      token: TokenResolver
    }
  },
  {
    path: 'registration',
    component: MainComponent,
    canActivate: [AuthGuard]
  }
];
