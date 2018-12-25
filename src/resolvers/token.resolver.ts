import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrationService } from '../modules';

@Injectable()
export class TokenResolver implements Resolve<any> {
  constructor() { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const token = route.params.token || localStorage.getItem('USER_TOKEN_KEY');
    return token;
  }
}
