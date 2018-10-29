import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './registration.routing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskModule } from 'ngx-mask';
import { RegStep1Component, RegStep2Component } from './components';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    RegStep1Component,
    RegStep2Component
  ],
  providers: [
    FormBuilder
  ]
})
export class RegistrationModule { }
