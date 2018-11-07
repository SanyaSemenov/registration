import { Routes } from '@angular/router';
import { RegStep1Component, RegStep2Component, RegStep3Component, MainComponent } from './components';

export const routes: Routes = [
  {
    path: 'registration/step1', component: RegStep1Component
  },
  {
    path: 'registration/step2', component: RegStep2Component
  },
  {
    path: 'registration/step3', component: RegStep3Component
  },
  // {
  //   path: '',
  //   redirectTo: 'step1',
  //   pathMatch: 'full'
  // },
  {
    path: 'registration',
    component: MainComponent
  }
];
