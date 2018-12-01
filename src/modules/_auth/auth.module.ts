import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { RegistrationService } from '../registration/registration.service';
import { ComponentsModule } from '../../components';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [],
  providers: [
    RegistrationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }
