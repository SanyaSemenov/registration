import { Injectable } from '@angular/core';
import { RequestParameter } from './request-parameter';
import { HttpParams, HttpClient } from '@angular/common/http';

const rootUrl = 'http://ch-invend0.1gb.ru/api/';

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
}
