import { Injectable } from '@angular/core';
import { mainPassportData } from './passport-data';
import { of, throwError } from 'rxjs';
import { MainPassportData } from '../modules/registration/lib/models';
import { errorResponse } from './error';
import { successResponse } from './success';
import { SmsResponse } from './sms-response';

@Injectable({
  providedIn: 'root',
})
export class FakeApiService {

  constructor() { }

  getMainPassportData() {
    return of(mainPassportData);
  }

  sendMainPassportData(body) {
    let check: MainPassportData;
    try {
      check = body;
    } catch (e) {
      return of(errorResponse);
    }
    return of(successResponse);
  }

  getPaymentAmount() {
    return of(100);
  }

  async getCode(phone): Promise<SmsResponse> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const seconds = Math.floor(Math.random() * 50 + 30);
        const response: SmsResponse = {
          attempts: 5,
          expiringSeconds: seconds
        };
        resolve(response);
      }, 2000);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sendCode(code) {
    const error = errorResponse;
    if (!code || code === '0000') {
      return throwError(error);
    }
    if (code === '6666') {
      error.code = 400;
      return throwError(error);
    }
    return of(successResponse);
  }
}
