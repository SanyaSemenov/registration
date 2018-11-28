import { NgModule } from '@angular/core';
import {
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatButtonModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const modules = [
  BrowserAnimationsModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatButtonModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class RegistrationMaterialModule { }
