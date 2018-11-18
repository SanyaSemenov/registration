import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './registration.routing';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskModule } from 'ngx-mask';
import {
  MainComponent,
  RegStep1Component,
  RegStep2Component,
  RegStep3Component,
  ConfirmStepComponent,
  PayStepComponent,
  FinishComponent,
  SmsStepComponent
} from './components';
import { RegistrationService } from './registration.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationStateService } from './lib';
import { PipesModule } from './lib/pipes/pipes.module';
import { FakeApiService } from '../../api/fake-api.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RegistrationMaterialModule } from './registration.material.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ApiService } from '../../api/api.service';
import {
  SignatureModalComponent,
  SignatureDialogComponent
} from './dialogs';
import { ComponentsModule } from '../../components';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { DirectivesModule } from './lib/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
    RegistrationMaterialModule,
    PdfViewerModule,
    SignaturePadModule,
    ComponentsModule,
    DirectivesModule,
    ModalDialogModule.forRoot(),
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
    SignatureDialogComponent,
    SignatureModalComponent,
    PayStepComponent,
    FinishComponent,
    SmsStepComponent
  ],
  providers: [
    FormBuilder,
    RegistrationService,
    LocationStateService,
    FakeApiService,
    ApiService
  ],
  entryComponents: [
    SignatureDialogComponent,
    SignatureModalComponent
  ]
})
export class RegistrationModule { }
