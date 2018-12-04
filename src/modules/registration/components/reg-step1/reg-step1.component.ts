import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../../validators';
import { RegistrationService } from '../../registration.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationStateService, MainPassportData } from '../../lib';

@Component({
  selector: 'app-reg-step1',
  templateUrl: './reg-step1.component.html',
  styleUrls: ['./reg-step1.component.less']
})
export class RegStep1Component implements OnInit {
  constructor(
    private fb: FormBuilder,
    public $service: RegistrationService,
    private location: LocationStateService
  ) {}

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly validationMessages = {
    wrongExtension: 'Допустимые форматы файла: '
  };

  ngUnsubscribe = new Subject<void>();

  form: FormGroup;
  isMainLoading = false;
  isSecondLoading = false;

  get mainUrl() {
    return this.$service.mainPassportUrl;
  }

  get secondUrl() {
    return this.$service.secondPassportUrl;
  }

  ngOnInit() {
    this.form = this.$service.passportImageForm;
  }

  onMainChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filename = file.name;
      this.form.controls['mainPassport'].patchValue(filename);
      const reader = new FileReader();

      if (
        this.$service.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1)
          .length > 0
      ) {
        this.isMainLoading = true;
        reader.readAsDataURL(file);
      } else {
        this.$service.mainPassportUrl = '';
      }

      reader.onload = (event: any) => {
        this.$service.mainPassportUrl = event.target.result;
        this.isMainLoading = false;
        this.$service.recognitionError = false;
        this.$service
          .sendFile(file)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: any) => {
            this.$service.PAGE1KEY = data.filename;
          });
        this.$service
          .postRegula()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (data: any) => {
              this.$service.recognitionError = false;
              if (!this.$service.mainPassportData) {
                this.$service.mainPassportData = {} as MainPassportData;
              }
              Object.keys(data).forEach(key => {
                if (data[key] !== null && typeof data[key] !== 'undefined') {
                  this.$service.mainPassportData[key] = typeof data[key] === 'string' ? data[key].toLowercase() : data[key];
                }
              });
              // {
              //   name: data.firstName ? data.firstName.toLowerCase() : '',
              //   surname: data.surName ? data.surName.toLowerCase() : '',
              //   patronymic: data.patronymic ? data.patronymic.toLowerCase() : '',
              //   dateOfBirth: this.convertDate(data.dateOfBirth),
              //   gender: data.gender ? data.gender.toLowerCase() : '',
              //   serialNumber: data.serialNumber,
              //   dateOfIssue: this.convertDate(data.dateOfIssue),
              //   placeOfIssue: data.placeOfIssue,
              //   issuerCode: data.issuerCode
              // };
              if (this.$service.loading) {
                this.$service.mainPassportForm.patchValue(
                  this.$service.mainPassportData
                );
              }
              this.$service.loading = false;
              console.log(this.$service.mainPassportData);
            },
            (error: HttpErrorResponse) => {
              this.$service.recognitionError = true;
              this.$service.behaviorRecognitionError.next(true);
              this.$service.loading = false;
            }
          );
      };
    }
    console.log(this.form);
  }

  convertDate(date: string): string {
    const components = date.split('/');
    const output = [];
    output.push(components[2]);
    output.push(components[0].length > 1 ? components[0] : '0' + components[0]);
    output.push(components[1].length > 1 ? components[1] : '0' + components[1]);
    return output.join('-');
  }

  onSecondChange(e) {
    if (e.target.files && e.target.files[0]) {
      const filename = e.target.files[0].name;
      this.form.controls['secondPassport'].patchValue(filename);
      const reader = new FileReader();

      if (
        this.$service.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1)
          .length > 0
      ) {
        this.isSecondLoading = true;
        reader.readAsDataURL(e.target.files[0]);
      } else {
        this.$service.secondPassportUrl = '';
      }
      reader.onload = (event: any) => {
        this.$service.secondPassportUrl = event.target.result;
        this.isSecondLoading = false;
      };
    }
    console.log(this.form);
  }

  submitForm(e) {
    console.log(this.form.value);
    // this.router.navigate(['step2']);
    if (this.$service.loading === false && this.$service.mainPassportData) {
      this.$service.mainPassportForm.patchValue(this.$service.mainPassportData);
    }
    this.onNavigate.emit(true);
  }

  skipStep(e) {
    this.$service.loading = false;
    this.onNavigate.emit(false);
  }
}
