import { Routes } from '@angular/router';
import { DecodeResolver, TokenResolver } from 'src/resolvers';
import { MainComponent } from './components';
import { AuthGuard } from '../_auth/auth.guard';


export const routes: Routes = [
  {
    path: 'registration/:token',
    component: MainComponent,
    resolve: {
      token: TokenResolver,
      decoded: DecodeResolver
    },
    // canActivate: [AuthGuard]
  },
  {
    path: 'registration',
    component: MainComponent
  }
];
