import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators';
import { MainPassportData } from './lib';
import { FakeApiService } from '../../api/fake-api.service';
import { ApiService } from '../../api/api.service';
import { BehaviorSubject } from 'rxjs';

export const QRCODE_STATE_KEY = 'QRCODE_STATE_KEY';

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
  public readonly SMS_STATE_RECIEVED = 'SMS_STATE_RECIEVED';
  public readonly SMS_STATE_INIT = 'SMS_STATE_INIT';
  public readonly SMS_STATE_EXPIRED = 'SMS_STATE_EXPIRED';
  public readonly SMS_STATE_ATTEMPTS_WASTED = 'SMS_STATE_ATTEMPTS_WASTED';
  public readonly SMS_STATE_KEY = 'SMS_STATE_KEY';
  public readonly SMS_EXPIRING_TIME_KEY = 'SMS_EXPIRING_TIME_KEY';
  public readonly SMS_ATTEMPTS_KEY = 'SMS_ATTEMPTS_KEY';

  private readonly attempts_factor = 9913;
  private readonly attempts_add = 76712;

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

  getCode(phoneNumber) {
    // TODO: заменить на реальную апишку
    return this.apiService.getCode(phoneNumber);
  }

  sendCode(code) {
    return this.apiService.sendCode(code);
  }

  setSmsState(state: string) {
    localStorage.setItem(this.SMS_STATE_KEY, state);
  }

  getSmsState(): boolean {
    return localStorage.getItem(this.SMS_STATE_KEY) === this.SMS_STATE_RECIEVED;
  }

  isInit(): boolean {
    return localStorage.getItem(this.SMS_STATE_KEY) === this.SMS_STATE_INIT;
  }

  setExpiringSeconds(seconds) {
    localStorage.setItem(this.SMS_EXPIRING_TIME_KEY, (new Date().getTime() + seconds * 1000).toString());
  }

  getExpiringSeconds(): number {
    const now = new Date().getTime();
    const expiring = Number(localStorage.getItem(this.SMS_EXPIRING_TIME_KEY));
    return Math.floor((expiring - now) / 1000);
  }

  setAttempts(attempts: number) {
    const store = attempts * this.attempts_factor + this.attempts_add;
    localStorage.setItem(this.SMS_ATTEMPTS_KEY, store.toString());
  }

  getAttempts(): number {
    const attempts = (Number(localStorage.getItem(this.SMS_ATTEMPTS_KEY)) - this.attempts_add) / this.attempts_factor;
    return attempts;
  }
}
