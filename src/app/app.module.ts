import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { RegistrationModule } from '../modules';
import { AuthModule } from '../modules/_auth/auth.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    RegistrationModule,
    // BrowserAnimationsModule,
    // AuthModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
