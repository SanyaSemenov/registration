import { NgModule } from '@angular/core';
import { MatSelectModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const modules: Array<any> = [
  BrowserAnimationsModule,
  MatSelectModule,
  MatDialogModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class RegistrationMaterialModule { }
