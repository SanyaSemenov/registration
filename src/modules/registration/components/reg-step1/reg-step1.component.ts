import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../../validators';

@Component({
  selector: 'app-reg-step1',
  templateUrl: './reg-step1.component.html',
  styleUrls: ['./reg-step1.component.less']
})
export class RegStep1Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      mainPassport: [
        '', [
          Validators.required,
          CustomValidators.imageExtensions(this.ALLOWED_EXTENSIONS)
        ]
      ],
      secondPassport: [
        '', [
          Validators.required,
          CustomValidators.imageExtensions(this.ALLOWED_EXTENSIONS)
        ]
      ]
    });
  }

  readonly ALLOWED_EXTENSIONS = [
    'jpg',
    'png',
    'jpeg'
  ];

  readonly validationMessages = {
    wrongExtension: 'Допустимые форматы файла: '
  };

  form: FormGroup;
  mainPassportUrl = '';
  secondPassportUrl = '';
  isMainLoading = false;
  isSecondLoading = false;

  ngOnInit() {
  }

  onMainChange(e) {
    if (e.target.files && e.target.files[0]) {
      const filename = e.target.files[0].name;
      this.form.controls['mainPassport'].patchValue(filename);
      const reader = new FileReader();

      if (this.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1).length > 0) {
        this.isMainLoading = true;
        reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (event: any) => {
        this.mainPassportUrl = event.target.result;
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

      if (this.ALLOWED_EXTENSIONS.filter(x => filename.indexOf(x) > -1).length > 0) {
        this.isSecondLoading = true;
        reader.readAsDataURL(e.target.files[0]);
      }


      reader.onload = (event: any) => {
        this.secondPassportUrl = event.target.result;
        this.isSecondLoading = false;
      };
    }
    console.log(this.form);
  }

  submitForm(e) {
    console.log(this.form.value);
    this.router.navigate(['step2']);
  }
}
