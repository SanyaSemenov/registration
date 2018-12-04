import { Injectable } from '@angular/core';
import { RequestParameter } from './request-parameter';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
}
