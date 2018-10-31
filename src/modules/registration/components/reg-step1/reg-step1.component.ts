import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../../validators';
import { RegistrationService } from '../../registration.service';

@Component({
  selector: 'app-reg-step1',
  templateUrl: './reg-step1.component.html',
  styleUrls: ['./reg-step1.component.less']
})
export class RegStep1Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private $service: RegistrationService
  ) { }

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly validationMessages = {
    wrongExtension: 'Допустимые форматы файла: '
  };

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
      const filename = e.target.files[0].name;
      this.form.controls['mainPassport'].patchValue(filename);
      const reader = new FileReader();

      if (this.$service.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1).length > 0) {
        this.isMainLoading = true;
        reader.readAsDataURL(e.target.files[0]);
      } else {
        this.$service.mainPassportUrl = '';
      }

      reader.onload = (event: any) => {
        this.$service.mainPassportUrl = event.target.result;
        this.isMainLoading = false;
      };
    }
    console.log(this.form);
  }

  onSecondChange(e) {
    if (e.target.files && e.target.files[0]) {
      const filename = e.target.files[0].name;
      this.form.controls['secondPassport'].patchValue(filename);
      const reader = new FileReader();

      if (this.$service.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1).length > 0) {
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
    this.onNavigate.emit(true);
  }

  skipStep(e) {
    this.onNavigate.emit(false);
  }
}
