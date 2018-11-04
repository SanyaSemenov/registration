import { Injectable } from '@angular/core';
import { mainPassportData } from './passport-data';
import { of } from 'rxjs';
import { MainPassportData } from '../modules/registration/lib/models';
import { errorResponse } from './error';
import { successResponse } from './success';

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
}
