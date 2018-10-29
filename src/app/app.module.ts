import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { RegistrationModule } from '../modules';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RegistrationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
