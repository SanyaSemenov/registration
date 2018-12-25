import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { TokenResolver } from 'src/resolvers/token.resolver';
import { AuthGuard } from '../_auth/auth.guard';
import { NotFoundComponent } from '../../components';

export const route: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [AuthGuard],
    resolve: {
      token: TokenResolver
    }
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: ':token',
    component: LandingComponent,
    resolve: {
      token: TokenResolver
    }
  }
];
