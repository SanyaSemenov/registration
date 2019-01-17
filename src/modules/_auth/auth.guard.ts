import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrationService } from '../registration/registration.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private service$: RegistrationService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (next.data['decoded']) {
      this.service$.setToken(next.data['token']);
      return true;
    }
    this.router.navigate(['404']);
    return false;
  }
}
