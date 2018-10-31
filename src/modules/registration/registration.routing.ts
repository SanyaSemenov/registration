import { Routes } from '@angular/router';
import { RegStep1Component, RegStep2Component, RegStep3Component, MainComponent } from './components';

export const routes: Routes = [
  {
    path: 'step1', component: RegStep1Component
  },
  {
    path: 'step2', component: RegStep2Component
  },
  {
    path: 'step3', component: RegStep3Component
  },
  // {
  //   path: '',
  //   redirectTo: 'step1',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: MainComponent
  }
];
