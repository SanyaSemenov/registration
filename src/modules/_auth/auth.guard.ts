import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { RegistrationService } from '../registration/registration.service';
import { API_CONFIG, ApiInjection } from 'src/api';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private service$: RegistrationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(API_CONFIG) config: BehaviorSubject<ApiInjection>) {
    config.subscribe((config: ApiInjection) => {
      this.isMock = config.mock;
    });
  }

  isMock: boolean;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isMock) {
      debugger;
      return true;
    }
    if (next.data['decoded']) {
      this.service$.setToken(next.data['token']);
      return true;
    }
    this.router.navigate(['404']);
    return false;
  }
}
