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
  ) {}

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
    loader: 'isMainLoading'
  };

  readonly secondPassportConfig: PassportConfig = {
    controlName: 'secondPassport',
    url: 'secondPassportUrl',
    pageKey: 'PAGE2KEY',
    loader: 'isSecondLoading'
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
    const components = date.split('/');
    const output = [];
    output.push(components[2]);
    output.push(components[0].length > 1 ? components[0] : '0' + components[0]);
    output.push(components[1].length > 1 ? components[1] : '0' + components[1]);
    return output.join('-');
  }

  onRegChange(e) {
    if (e.target.files && e.target.files[0]) {
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
        this.isRegLoading = false;
      };
    }
    console.log(this.form);
  }

  submitForm(e) {
    console.log(this.form.value);
    // this.router.navigate(['step2']);
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
          .sendFile(file)
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
                this.service$.mainPassportData = {} as MainPassportData;
              }
              Object.keys(data).forEach(key => {
                if (data[key] !== null && typeof data[key] !== 'undefined') {
                  this.service$.mainPassportData[key] =
                    typeof data[key] === 'string'
                      ? data[key].toLowercase()
                      : data[key];
                }
              });
              if (this.service$.loading) {
                this.service$.mainPassportForm.patchValue(
                  this.service$.mainPassportData
                );
              }
              this.service$.loading = false;
              console.log(this.service$.mainPassportData);
            },
            (error: HttpErrorResponse) => {
              this.service$.recognitionError = true;
              this.service$.behaviorRecognitionError.next(true);
              this.service$.loading = false;
            }
          );
      };
    }
    console.log(this.form);
  }

  skipStep(e) {
    this.service$.loading = false;
    this.onNavigate.emit(false);
  }
}
