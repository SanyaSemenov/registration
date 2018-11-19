import { NgModule } from '@angular/core';
import { MatSelectModule, MatDialogModule, MatCheckboxModule, MatAutocompleteModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const modules = [
  BrowserAnimationsModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatAutocompleteModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class RegistrationMaterialModule { }
