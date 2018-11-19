import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatAutocompleteModule } from '@angular/material';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

const components = [
  NotFoundComponent,
  LoaderComponent,
  DialogComponent,
  AutocompleteComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule
  ],
  declarations: components,
  exports: components
})
export class ComponentsModule { }
