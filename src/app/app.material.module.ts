import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatSelectModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule
    // MaterializeModule
  ],
  exports: [
    MatSelectModule
  ],
  providers: []
})
export class AppMaterialModule { }
