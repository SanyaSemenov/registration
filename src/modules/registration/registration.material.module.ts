import { NgModule } from '@angular/core';
import { MatSelectModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const modules = [
  BrowserAnimationsModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class RegistrationMaterialModule { }
