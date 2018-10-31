import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators';
import { MainPassportData } from './lib';
import { FakeApiService } from '../../api/fake-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private fb: FormBuilder,
    private apiService: FakeApiService
  ) {
    this.passportImageForm = this.fb.group({
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
    this.mainPassportForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      middleName: ['', Validators.required],
      birth: [new Date(), Validators.required],
      passportNumber: ['', Validators.required]
    });
  }

  readonly ALLOWED_EXTENSIONS = [
    'jpg',
    'png',
    'jpeg'
  ];

  mainPassportUrl;
  secondPassportUrl;
  passportImageForm: FormGroup;
  mainPassportForm: FormGroup;
  mainPassportData: MainPassportData;

  getMainRecognizedData() {
    return this.apiService.getMainPassportData();
    // this.apiService.getMainPassportData().subscribe((data: MainPassportData) => {
    //   this.mainPassportData = data;
    // });
  }

  clearMainPassportForm() {
    this.mainPassportForm.reset();
  }
}
