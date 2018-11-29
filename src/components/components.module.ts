import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegistrationMaterialModule } from '../modules/registration/registration.material.module';

const components = [
  NotFoundComponent,
  LoaderComponent,
  DialogComponent,
  // AutocompleteComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistrationMaterialModule
  ],
  declarations: components,
  exports: components
})
export class ComponentsModule { }
