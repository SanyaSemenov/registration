import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { RouterModule } from '@angular/router';
import { route } from './landing.routing';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '../_auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    RouterModule.forChild(route)
  ],
  declarations: [LandingComponent]
})
export class LandingModule { }
