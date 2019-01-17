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
import { SignatureModalComponent } from './dialogs';
import { ComponentsModule } from '../../components';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { DirectivesModule } from './lib/directives/directives.module';
import { MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KladrModule } from 'angular-kladr';
import { TokenResolver } from 'src/resolvers/token.resolver';
import { AuthModule } from '../_auth/auth.module';
import { DecodeResolver } from '../../resolvers';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
    RegistrationMaterialModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    PdfViewerModule,
    SignaturePadModule,
    ComponentsModule,
    DirectivesModule,
    KladrModule,
    AuthModule,
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
    ApiService,
    TokenResolver,
    DecodeResolver
  ],
  entryComponents: [
    SignatureModalComponent
  ]
})
export class RegistrationModule { }
