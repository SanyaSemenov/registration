import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../../validators';
import { RegistrationService } from '../../registration.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationStateService, MainPassportData } from '../../lib';
import { PassportConfig } from '../../lib/models/passport-config.interface';

@Component({
  selector: 'app-reg-step1',
  templateUrl: './reg-step1.component.html',
  styleUrls: ['./reg-step1.component.less']
})
export class RegStep1Component implements OnInit {
  constructor(
    private fb: FormBuilder,
    public service$: RegistrationService,
    private location: LocationStateService
  ) { }

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly validationMessages = {
    wrongExtension: 'Допустимые форматы файла: '
  };

  readonly mainPassportConfig: PassportConfig = {
    controlName: 'mainPassport',
    url: 'mainPassportUrl',
    pageKey: 'PAGE1KEY',
    loader: 'isMainLoading',
    requestLoader: 'isMainRequestLoading'
  };

  readonly secondPassportConfig: PassportConfig = {
    controlName: 'secondPassport',
    url: 'secondPassportUrl',
    pageKey: 'PAGE2KEY',
    loader: 'isSecondLoading',
    requestLoader: 'isSecondRequestLoading'
  };

  ngUnsubscribe = new Subject<void>();

  form: FormGroup;
  isMainLoading = false;
  isSecondLoading = false;
  isRegLoading = false;

  get mainUrl() {
    return this.service$.mainPassportUrl;
  }

  get secondUrl() {
    return this.service$.secondPassportUrl;
  }

  get registrationUrl() {
    return this.service$.registrationPageUrl;
  }

  ngOnInit() {
    this.form = this.service$.passportImageForm;
  }

  onMainChange(e) {
    this.mainPassportPagesUpload(e, this.mainPassportConfig);
  }

  onSecondChange(e) {
    this.mainPassportPagesUpload(e, this.secondPassportConfig);
  }

  convertDate(date: string): string {
    if (!date) {
      return null;
    }
    const components = date.split('/');
    const output = [];
    output.push(components[2]);
    output.push(components[0].length > 1 ? components[0] : '0' + components[0]);
    output.push(components[1].length > 1 ? components[1] : '0' + components[1]);
    return output.join('-');
  }

  onRegChange(e) {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (file) {
      const filename = e.target.files[0].name;
      this.form.controls['registrationPage'].patchValue(filename);
      const reader = new FileReader();

      if (
        this.service$.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1)
          .length > 0
      ) {
        this.isRegLoading = true;
        reader.readAsDataURL(e.target.files[0]);
      } else {
        this.service$.registrationPageUrl = '';
      }
      reader.onload = (event: any) => {
        this.service$.registrationPageUrl = event.target.result;
        this.service$
          .sendFile(file, this.service$.isRegRequestLoading)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: any) => {
            this.service$.PAGE3KEY = data.filename;
          });
        this.isRegLoading = false;
      };
    }
    console.log(this.form);
  }

  submitForm(e) {
    console.log(this.form.value);
    if (this.service$.loading === false && this.service$.mainPassportData) {
      this.service$.mainPassportForm.patchValue(this.service$.mainPassportData);
    }
    this.onNavigate.emit(true);
  }

  mainPassportPagesUpload(e, config: PassportConfig) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filename = file.name;
      this.form.controls[config.controlName].patchValue(filename);
      const reader = new FileReader();

      if (
        this.service$.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1)
          .length > 0
      ) {
        this[config.loader] = true;
        reader.readAsDataURL(file);
      } else {
        this.service$[config.url] = '';
      }

      reader.onload = (event: any) => {
        this.service$[config.url] = event.target.result;
        this[config.loader] = false;
        this.service$.recognitionError = false;
        this.service$
          .sendFile(file, this.service$[config.requestLoader])
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: any) => {
            this.service$[config.pageKey] = data.filename;
          });
        this.service$
          .postRegula()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (data: any) => {
              this.service$.recognitionError = false;
              if (!this.service$.mainPassportData) {
                this.service$.mainPassportData = new MainPassportData();
              }
              const obj = {
                firstName: data.firstName ? data.firstName.toLowerCase() : '',
                surname: data.surName ? data.surName.toLowerCase() : '',
                patronymic: data.patronymic ? data.patronymic.toLowerCase() : '',
                dateOfBirth: this.convertDate(data.dateOfBirth),
                gender: data.gender ? data.gender.toLowerCase() : '',
                serialNumber: data.serialNumber,
                dateOfIssue: this.convertDate(data.dateOfIssue),
                issuedBy: data.issuedBy,
                issuerCode: data.issuerCode
              };
              Object.keys(obj).forEach(key => {
                if (!obj[key]) {
                  delete obj[key];
                }
              });
              this.service$.mainPassportData = Object.assign<MainPassportData, any>(this.service$.mainPassportData, obj);
              // Object.keys(data).forEach(key => {
              //   if (data[key] !== null && typeof data[key] !== 'undefined') {
              //     this.service$.mainPassportData[key] =
              //       typeof data[key] === 'string'
              //         ? data[key].toLowercase()
              //         : data[key];
              //   }
              // });
              this.service$.setPassportDataIntoStorage();
              if (this.service$.loading) {
                this.service$.mainPassportForm.patchValue(
                  this.service$.mainPassportData
                );
              }
              this.service$.isMainRequestLoading = false;
              this.service$[config.requestLoader] = false;
              // this.service$.loading = false;
              console.log(this.service$.mainPassportData);
            },
            (error: HttpErrorResponse) => {
              this.service$.recognitionError = true;
              this.service$.behaviorRecognitionError.next(true);
              this.service$[config.requestLoader] = false;
              // this.service$.loading = false;
            });
      };
    }
    console.log(this.form);
  }

  skipStep(e) {
    this.service$.isMainRequestLoading = false;
    this.service$.isSecondRequestLoading = false;
    // this.service$.loading = false;
    this.onNavigate.emit(false);
  }
}
