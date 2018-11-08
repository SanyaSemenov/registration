import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { RegistrationModule } from '../modules';
import { AppMaterialModule } from './app.material.module';
import { MatSelectModule } from '@angular/material';
import { AuthModule } from '../modules/_auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    RegistrationModule,
    BrowserAnimationsModule,
    AuthModule
    // AppMaterialModule,
    // MatSelectModule
    // MaterializeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
