import { Injectable } from '@angular/core';
import { RequestParameter } from './request-parameter';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { MainPassportData } from '../modules/registration/lib';
import { map, first } from 'rxjs/operators';
import { ResponseContentType } from '@angular/http';

const rootUrl = 'https://ch.invend.ru/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  BASE_GetRequest(request: string, parameters: RequestParameter[]) {
    if (parameters) {
      const params = new HttpParams();
      parameters.forEach(element => {
        params.set(element.name, element.value);
      });
      return this.http.get(rootUrl + request, { params });
    } else {
      return this.http.get(rootUrl + request);
    }
  }

  postRegula(body) {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'No-Auth': 'True' });
    return this.http.post(rootUrl + '/regula/', body, { headers: reqHeader });
  }

  sendFile(file: File) {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(rootUrl + '/file', formData);
  }

  getCode(phoneNumber): Observable<any> {
    const body = {
      phoneNumber: phoneNumber
    };
    return this.http.post(rootUrl + '/confirmation', body);
  }

  sendCode(code) {
    const body = {
      code: code
    };
    return this.http.put(rootUrl + '/confirmation', body);
  }

  sendPassport(data: MainPassportData): Observable<any> {
    return this.http.post(rootUrl + '/document/passport', data);
  }

  sendSignature(data: string) {
    return this.http.put(rootUrl + '/reservation/signature', { signature: data });
  }

  getSignatureDoc() {
    return this.http.get(rootUrl + '/reservation/signature')
      .pipe(map((data: any) => data.files && data.files.length > 0 ? data.files[0].fileName : ''));
  }

  getDoc(name) {
    return this.http.get(rootUrl + '/file/' + name, {
      headers: {
        'Accept': 'application/pdf'
      },
      responseType: 'arraybuffer'
    })
      .pipe(
        map((file: ArrayBuffer) => new Uint8Array(file))
      );
  }
}
