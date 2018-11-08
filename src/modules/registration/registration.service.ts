import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators';
import { MainPassportData } from './lib';
import { FakeApiService } from '../../api/fake-api.service';
import { ApiService } from '../../api/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  public loading = false;
  public mainPassportUrl;
  public secondPassportUrl;
  public passportImageForm: FormGroup;
  public mainPassportForm: FormGroup;
  public registrationPassportForm: FormGroup;
  public mainPassportData: MainPassportData;
  public mainPassportDataFilled = false;
  public recognitionError = false;
  public behaviorRecognitionError = new BehaviorSubject<boolean>(false);

  readonly ALLOWED_EXTENSIONS = [
    'jpg',
    'png',
    'jpeg'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: FakeApiService,
    private api: ApiService
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
      patronymic: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [new Date(), Validators.required],
      serialNumber: [
        '', [
          Validators.required,
          Validators.minLength(10),
        ]
      ],
      placeOfIssue: ['', Validators.required],
      dateOfIssue: ['', Validators.required],
      issuerCode: [
        '', [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });

    this.mainPassportForm.valueChanges.subscribe((data) => {
      console.log(this.mainPassportForm);
    });

    this.registrationPassportForm = this.fb.group({
      region: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      housing: [''],
      structure: [''],
      appartment: ['']
    });
  }

  getMainRecognizedData() {
    this.mainPassportDataFilled = true;
    return this.apiService.getMainPassportData();
  }

  clearMainPassportForm() {
    this.mainPassportForm.reset();
  }

  getPaymentAmount() {
    return this.apiService.getPaymentAmount();
  }

  postRegula() {
    this.loading = true;
    const body = {
      base64Image: this.mainPassportUrl,
      imageExtension: 'png'
    };
    return this.api.postRegula(body);
  }
}
