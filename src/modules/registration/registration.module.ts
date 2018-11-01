import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './registration.routing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskModule } from 'ngx-mask';
import {
  MainComponent,
  RegStep1Component,
  RegStep2Component,
  RegStep3Component
} from './components';
import { RegistrationService } from './registration.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationStateService } from './lib';
import { PipesModule } from './lib/pipes/pipes.module';
import { FakeApiService } from '../../api/fake-api.service';
import { ConfirmStepComponent } from './components/confirm-step/confirm-step.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SignatureDialogComponent } from './dialogs/signature-dialog/signature-dialog.component';
import { RegistrationMaterialModule } from './registration.material.module';
import { AngularSignaturePadModule } from 'angular-signature-pad/src/angular-signature-pad.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
    RegistrationMaterialModule,
    PdfViewerModule,
    AngularSignaturePadModule.forRoot(),
    NgxMaskModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    MainComponent,
    RegStep1Component,
    RegStep2Component,
    RegStep3Component,
    MainComponent,
    ConfirmStepComponent,
    SignatureDialogComponent
  ],
  providers: [
    FormBuilder,
    RegistrationService,
    LocationStateService,
    FakeApiService
  ],
  entryComponents: [
    SignatureDialogComponent
  ]
})
export class RegistrationModule { }
