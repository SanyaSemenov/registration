import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestParameter } from './request-parameter';
import { SearchContext, ContentType } from '../modules/registration/lib';

const rootUrl = 'https://kladr-api.ru/api.php';
const LIMIT = 5;

@Injectable({
  providedIn: 'root'
})
export class KladrService {

  constructor(private http: HttpClient) { }

  // BASE_GetRequest(parameters: RequestParameter[]) {
  //   if (parameters) {
  //     const params = new HttpParams();
  //     parameters.forEach(element => {
  //       params.set(element.name, element.value);
  //     });
  //     return this.http.get(rootUrl, { params });
  //   } else {
  //     return this.http.get(rootUrl);
  //   }
  // }

  BASE_KLADR_GET(context: SearchContext) {
    if (context) {
      const params = new HttpParams();
      Object.keys(context).forEach(key => {
        params.set(key, context[key]);
      });
      return this.http.get(rootUrl, { params });
    } else {
      return this.http.get(rootUrl);
    }
  }

  // getRegions(query) {
  //   const params: RequestParameter[] = [
  //     {
  //       name: 'contentType',
  //       value: 'region'
  //     },
  //     {
  //       name: 'limit',
  //       value: 5
  //     },
  //     {
  //       name: 'query',
  //       value: query
  //     }
  //   ];
  //   return this.BASE_GetRequest(params);
  // }

  // getCities(query, regionId) {
  //   const params: RequestParameter[] = [
  //     {
  //       name: 'contentType',
  //       value: 'region'
  //     },
  //     {
  //       name: 'limit',
  //       value: 5
  //     },
  //     {
  //       name: 'query',
  //       value: query
  //     },
  //     {
  //       name: 'regionId',
  //       value: regionId
  //     }
  //   ];
  //   return this.BASE_GetRequest(params);
  // }

  getRegionsList(query) {
    const context: SearchContext = {
      contentType: ContentType.region,
      limit: LIMIT,
      query: query
    };
    return this.BASE_KLADR_GET(context);
  }

  getCitiesList(query, regionId) {
    const context: SearchContext = {
      contentType: ContentType.city,
      limit: LIMIT,
      regionId: regionId,
      query: query
    };
    return this.BASE_KLADR_GET(context);
  }

  getStreetsList(query, cityId) {
    const context: SearchContext = {
      contentType: ContentType.street,
      limit: LIMIT,
      cityId: cityId,
      query: query
    };
    return this.BASE_KLADR_GET(context);
  }

  getBuildingsList(query, streetId) {
    const context: SearchContext = {
      contentType: ContentType.building,
      limit: LIMIT,
      streetId: streetId,
      query: query
    };
    return this.BASE_KLADR_GET(context);
  }
}
