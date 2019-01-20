import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators';
import { MainPassportData } from './lib';
import { FakeApiService } from '../../api/fake-api.service';
import { ApiService } from '../../api/api.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import {
  KladrService,
  BaseResponse,
  ContentType,
  SearchContext
} from 'angular-kladr';
import { SmsResponse } from '../../api/sms-response';
import { takeUntil } from 'rxjs/operators';

export const QRCODE_STATE_KEY = 'QRCODE_STATE_KEY';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService implements OnDestroy {
  public mainPassportUrl;
  public secondPassportUrl;
  public registrationPageUrl;
  public passportImageForm: FormGroup;
  public mainPassportForm: FormGroup;
  public registrationPassportForm: FormGroup;
  public mainPassportData: MainPassportData;
  public mainPassportDataFilled = false;
  public recognitionError = false;
  private _PAGE1KEY: string;
  private _PAGE2KEY: string;
  private _PAGE3KEY: string;
  public isMainLoading = false;
  public isSecondLoading = false;
  public isMainRequestLoading = false;
  public isSecondRequestLoading = false;
  public isRegRequestLoading = false;
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
  public readonly RESERVATION_ID_KEY = 'RESERVATION_ID_KEY';
  public readonly TOKEN_EXPIRING_KEY = 'TOKEN_EXPIRING_KEY';
  public readonly PASSPORT_KEY = 'PASSPORT_KEY';

  public readonly DEBOUNCE_TIME = 100;

  private readonly attempts_factor = 9913;
  private readonly attempts_add = 76712;

  readonly ALLOWED_EXTENSIONS = ['jpg', 'png', 'jpeg', 'bpm'];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: FakeApiService,
    private api: ApiService,
    private kladr$: KladrService
  ) {
    this.mainPassportData = { ...this.getPassportDataFromStorage() };
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
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      patronymic: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [new Date(), Validators.required],
      placeOfBirth: ['', Validators.required],
      serialNumber: ['', [Validators.required, Validators.minLength(10)]],
      issuedBy: ['', Validators.required],
      dateOfIssue: ['', Validators.required],
      issuerCode: ['', [Validators.required, Validators.minLength(6)]]
    });
    if(this.mainPassportData) {
      this.mainPassportForm.patchValue(this.mainPassportData);
    }

    this.registrationPassportForm = this.fb.group({
      region: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      apartment: ['']
    });
  }

  get PAGE1KEY(): string {
    return this._PAGE1KEY;
  }

  set PAGE1KEY(value: string) {
    this._PAGE1KEY = value;
    if (!this.mainPassportData) {
      this.mainPassportData = new MainPassportData();
    }
    this.mainPassportData.page1 = value;
  }

  get PAGE2KEY(): string {
    return this._PAGE2KEY;
  }

  set PAGE2KEY(value: string) {
    this._PAGE2KEY = value;
    if (!this.mainPassportData) {
      this.mainPassportData = new MainPassportData();
    }
    this.mainPassportData.page2 = value;
  }

  get PAGE3KEY(): string {
    return this._PAGE3KEY;
  }

  set PAGE3KEY(value: string) {
    this._PAGE3KEY = value;
    if (!this.mainPassportData) {
      this.mainPassportData = new MainPassportData();
    }
    this.mainPassportData.page3 = value;
  }

  get loading() {
    return this.isMainRequestLoading || this.isSecondRequestLoading;
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

  public setReservationId(id: number) {
    localStorage.setItem(this.RESERVATION_ID_KEY, id.toString());
  }

  public getReservationId(): number {
    return +localStorage.getItem(this.RESERVATION_ID_KEY);
  }

  public setExiringDate(time: number) {
    localStorage.setItem(this.TOKEN_EXPIRING_KEY, time.toString());
  }

  public getExiringDate(): number {
    return +localStorage.getItem(this.TOKEN_EXPIRING_KEY);
  }

  getMainRecognizedData() {
    this.mainPassportDataFilled = true;
    return this.apiService.getMainPassportData();
  }

  clearMainPassportForm() {
    this.mainPassportForm.reset();
  }

  sendPassportData(): Observable<any> {
    const registrationAddress = Object.values(this.registrationPassportForm.value).join(',');
    this.mainPassportData = { ...this.mainPassportData, ...this.mainPassportForm.value, registrationAddress: registrationAddress };
    return this.api.sendPassport(this.mainPassportData);
  }

  getPaymentAmount() {
    return this.apiService.getPaymentAmount();
  }

  sendFile(file, loader?) {
    if (loader === true || loader === false) {
      loader = true;
    }
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
    return this.api.getCode(phoneNumber);
  }

  sendCode(code) {
    return this.api.sendCode(code);
  }

  getSignatureDoc() {
    return this.api.getSignatureDoc();
  }

  sendSignature(data): Observable<any> {
    return this.api.sendSignature(data);
  }

  getDoc(name) {
    return this.api.getDoc(name);
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
    this.kladr$.api(context)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => console.log(data));
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
