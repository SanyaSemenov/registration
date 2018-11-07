import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// tslint:disable-next-line:max-line-length
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjoiVXNlciIsIlVzZXJJZCI6IjEiLCJleHAiOjE1MzQ0Mjg0NTAsImlzcyI6ImludmVuZC5ydSJ9.8hU-GT9Vqp5T1QNXzA-iXlYoS5-qHuLeK8TX6bmAKOI';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone()).pipe(
        tap(
          succ => {
            const response: any = succ;
            if (response.body) {
              localStorage.setItem('userToken', response.body.token ? response.body.token : token);
              // localStorage.setItem('userRoles', response.body.roles);
            }
          },
          err => {
            this.Logout();
          }
        )
      );
    }

    if (localStorage.getItem('userToken') != null) {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
        // headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
      });
      console.log(clonedreq);
      return next.handle(clonedreq)
        .pipe(
          tap(
            succ => { },
            err => {
              if (err.status === 401) {
                this.router.navigateByUrl('/login');
              }
              if (err.status === 403) {
                this.router.navigateByUrl('/login');
              }

              localStorage.removeItem('userToken');
              // localStorage.removeItem('userRoles');
            }
          )
        );
    } else {
      this.Logout();
    }
  }

  Logout() {
    this.router.navigateByUrl('/login');
    localStorage.removeItem('userToken');
    // localStorage.removeItem('userRoles');
  }
}
