import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestParameter } from './request-parameter';

const rootUrl = 'https://kladr-api.ru/api.php';

@Injectable({
  providedIn: 'root'
})
export class KladrService {

  constructor(private http: HttpClient) { }

  BASE_GetRequest(parameters: RequestParameter[]) {
    if (parameters) {
      const params = new HttpParams();
      parameters.forEach(element => {
        params.set(element.name, element.value);
      });
      return this.http.get(rootUrl, { params });
    } else {
      return this.http.get(rootUrl);
    }
  }

  getRegions(query) {
    const params = [
      {
        name: 'contentType',
        value: 'region'
      },
      {
        name: 'limit',
        value: 5
      },
      {
        name: 'query',
        value: query
      }
    ];
    return this.BASE_GetRequest(params);
  }
}
