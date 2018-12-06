import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators';
import { MainPassportData } from './lib';
import { FakeApiService } from '../../api/fake-api.service';
import { ApiService } from '../../api/api.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, switchMap, map } from 'rxjs/operators';
import {
  KladrService,
  BaseResponse,
  ContentType,
  SearchContext
} from 'angular-kladr';
import { SmsResponse } from '../../api/sms-response';

export const QRCODE_STATE_KEY = 'QRCODE_STATE_KEY';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  public loading = false;
  public mainPassportUrl;
  public secondPassportUrl;
  public registrationPageUrl;
  public passportImageForm: FormGroup;
  public mainPassportForm: FormGroup;
  public registrationPassportForm: FormGroup;
  public mainPassportData: MainPassportData;
  public mainPassportDataFilled = false;
  public recognitionError = false;
  public PAGE1KEY: string;
  public PAGE2KEY: string;
  public PAGE3KEY: string;
  public behaviorRecognitionError = new BehaviorSubject<boolean>(false);
  public behaviorSmsError = new BehaviorSubject<any>(null);
  public readonly SMS_STATE_RECIEVED = 'SMS_STATE_RECIEVED';
  public readonly SMS_STATE_INIT = 'SMS_STATE_INIT';
  public readonly SMS_STATE_EXPIRED = 'SMS_STATE_EXPIRED';
  public readonly SMS_STATE_ATTEMPTS_WASTED = 'SMS_STATE_ATTEMPTS_WASTED';
  public readonly SMS_STATE_KEY = 'SMS_STATE_KEY';
  public readonly SMS_EXPIRING_TIME_KEY = 'SMS_EXPIRING_TIME_KEY';
  public readonly SMS_ATTEMPTS_KEY = 'SMS_ATTEMPTS_KEY';
  public readonly USER_TOKEN_KEY = 'USER_TOKEN_KEY';
  public readonly PASSPORT_KEY = 'PASSPORT_KEY';

  public readonly DEBOUNCE_TIME = 100;

  private readonly attempts_factor = 9913;
  private readonly attempts_add = 76712;

  readonly ALLOWED_EXTENSIONS = ['jpg', 'png', 'jpeg'];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: FakeApiService,
    private api: ApiService,
    private kladr$: KladrService
  ) {
    this.passportImageForm = this.fb.group({
      mainPassport: [
        '',
        [
          Validators.required,
          CustomValidators.imageExtensions(this.ALLOWED_EXTENSIONS)
        ]
      ],
      secondPassport: [
        '',
        [
          Validators.required,
          CustomValidators.imageExtensions(this.ALLOWED_EXTENSIONS)
        ]
      ],
      registrationPage: [
        '',
        [
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
      serialNumber: ['', [Validators.required, Validators.minLength(10)]],
      placeOfIssue: ['', Validators.required],
      dateOfIssue: ['', Validators.required],
      issuerCode: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.mainPassportForm.valueChanges.subscribe(data => {
      console.log(this.mainPassportForm);
    });

    this.registrationPassportForm = this.fb.group({
      region: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      apartment: ['']
    });
  }

  public setToken(token) {
    localStorage.setItem(this.USER_TOKEN_KEY, token);
  }

  public getToken(): string {
    const token = localStorage.getItem(this.USER_TOKEN_KEY);
    return typeof token !== 'undefined' && token && token !== 'undefined'
      ? token
      : '';
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

  sendFile(file) {
    this.loading = true;
    return this.api.sendFile(file);
  }

  postRegula() {
    const body = {
      base64Image: this.mainPassportUrl,
      imageExtension: 'png'
    };
    return this.api.postRegula(body);
  }

  getCode(phoneNumber): Observable<SmsResponse> {
    // TODO: заменить на реальную апишку
    // return this.apiService.getCode(phoneNumber);
    return this.api.getCode(phoneNumber);
  }

  sendCode(code) {
    // return this.apiService.sendCode(code);
    return this.api.sendCode(code);
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

  setExpiringSeconds(date) {
    localStorage.setItem(
      this.SMS_EXPIRING_TIME_KEY,
      (new Date(date).getTime()).toString()
    );
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
    const attempts =
      (Number(localStorage.getItem(this.SMS_ATTEMPTS_KEY)) -
        this.attempts_add) /
      this.attempts_factor;
    return attempts;
  }

  setPassportDataIntoStorage() {
    const json = JSON.stringify(this.mainPassportData);
    localStorage.setItem(this.PASSPORT_KEY, json);
  }

  getPassportDataFromStorage() {
    const data = JSON.parse(localStorage.getItem(this.PASSPORT_KEY));
    return data;
  }

  // KLADR API
  getRegions(query): Observable<BaseResponse> {
    const context: SearchContext = {
      limit: 5,
      contentType: ContentType.region,
      query: query
    };
    this.kladr$.api(context).subscribe(data => console.log(data));
    return this.kladr$.api(context);
  }

  getCities(query, regionId) {
    const context: SearchContext = {
      limit: 5,
      contentType: ContentType.city,
      query: query,
      regionId: regionId
    };
    return this.kladr$.api(context);
  }

  getStreets(query, cityId) {
    const context: SearchContext = {
      limit: 5,
      contentType: ContentType.street,
      query: query,
      cityId: cityId
    };
    return this.kladr$.api(context);
  }

  getBuildings(query, streetId) {
    const context: SearchContext = {
      limit: 5,
      contentType: ContentType.building,
      query: query,
      streetId: streetId
    };
    return this.kladr$.api(context);
  }
}
