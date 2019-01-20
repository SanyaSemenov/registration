import { Injectable, Inject } from '@angular/core';
import { RequestParameter } from './request-parameter';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { MainPassportData } from '../modules/registration/lib';
import { map, first } from 'rxjs/operators';
import { ResponseContentType } from '@angular/http';
import { API_CONFIG, REMOTE_API } from './injection-token';
import { ApiInjection } from './api-injection.interface';

// const this.config.endpoint = 'https://ch.invend.ru/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) config: BehaviorSubject<ApiInjection>
  ) {
    config.subscribe((config: ApiInjection) => {
      this.config = config;
    });
  }

  config: ApiInjection;
  BASE_GetRequest(request: string, parameters: RequestParameter[]) {
    if (parameters) {
      const params = new HttpParams();
      parameters.forEach(element => {
        params.set(element.name, element.value);
      });
      return this.http.get(this.config.endpoint + request, { params });
    } else {
      return this.http.get(this.config.endpoint + request);
    }
  }

  postRegula(body) {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/regula/post.json');
    }
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'No-Auth': 'True' });
    return this.http.post(this.config.endpoint + '/regula/', body, { headers: reqHeader });
  }

  sendFile(file: File) {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/file/post.json');
    }
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.config.endpoint + '/file', formData);
  }

  getCode(phoneNumber): Observable<any> {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/confirmation/post.json');
    }
    const body = {
      phoneNumber: phoneNumber
    };
    return this.http.post(this.config.endpoint + '/confirmation', body);
  }

  sendCode(code) {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/confirmation/put.json');
    }
    const body = {
      code: code
    };
    return this.http.put(this.config.endpoint + '/confirmation', body);
  }

  sendPassport(data: MainPassportData): Observable<any> {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/document/passport/post.json');
    }
    return this.http.post(this.config.endpoint + '/document/passport', data);
  }

  sendSignature(data: string) {
    if (this.config.mock) {
      return this.BASE_GET_JSON('/reservation/signature/get.json');
    }
    return this.http.put(this.config.endpoint + '/reservation/signature', { signature: data });
  }

  getSignatureDoc() {
    // TODO: для моков вернуть адрес файла и в компоненте отдать адрес
    return this.http.get(this.config.endpoint + '/reservation/signature')
      .pipe(map((data: any) => data.files && data.files.length > 0 ? data.files[0].fileName : ''));
  }

  getDoc(name) {
    // TODO: для моков вернуть адрес файла и в компоненте отдать адрес
    return this.http.get(this.config.endpoint + '/file/' + name, {
      headers: {
        'Accept': 'application/pdf'
      },
      responseType: 'arraybuffer'
    })
      .pipe(
        map((file: ArrayBuffer) => new Uint8Array(file))
      );
  }

  BASE_GET_JSON(path) {
    return this.http.get(this.config.endpoint + path);
      // .pipe(map((value: string) => JSON.parse(value)));
  }
}
