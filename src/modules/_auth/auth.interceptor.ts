import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration/registration.service';

// tslint:disable-next-line:max-line-length
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjoiVXNlciIsIlVzZXJJZCI6IjIiLCJSZXNlcnZhdGlvbklkIjoiMzMyMDMiLCJleHAiOjE1NDY3OTM4MjcsImlzcyI6ImludmVuZC5ydSJ9.kuRmUWj4nUhQ-Ypdm2RpR70twbUeE9gYmwkBgYcjpS0';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private service$: RegistrationService) {
    this.tokenKey = this.service$.USER_TOKEN_KEY;
  }
  tokenKey: string;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (req.headers.get('No-Auth') === 'True') {
    //   return next.handle(req.clone()).pipe(
    //     tap(
    //       succ => {
    //         const response: any = succ;
    //         if (response.body) {
    //           localStorage.setItem(this.tokenKey, response.body.token ? response.body.token : token);
    //           // localStorage.setItem('userRoles', response.body.roles);
    //         }
    //       },
    //       err => {
    //         this.Logout();
    //       }
    //     )
    //   );
    // }

    if (req.headers.get('No-Auth') === 'True') {
      const clonedreq = req.clone();
      console.log('no-auth-headers', clonedreq.headers.getAll('No-Auth'));
      return next.handle(clonedreq).pipe(tap(succ => {}, err => {}));
    }
    const storageToken = localStorage.getItem(this.tokenKey);

    if (storageToken !== null) {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + storageToken)
        // headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
      });
      console.log(clonedreq);
      return next.handle(clonedreq)
        .pipe(
          tap(
            succ => { },
            err => {
              if (err.status === 401) {
                // this.router.navigateByUrl('/login');
              }
              if (err.status === 403) {
                // this.router.navigateByUrl('/login');
              }

              // localStorage.removeItem(this.tokenKey);
              // localStorage.removeItem('userRoles');
            }
          )
        );
    } else {
      this.Logout();
    }
  }

  Logout() {
    // this.router.navigateByUrl('/login');
    // localStorage.removeItem(this.tokenKey);
    // localStorage.removeItem('userRoles');
  }
}
