import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SmsResponse } from 'src/api/sms-response';
import { RegistrationService } from '../../registration.service';

@Component({
  selector: 'app-sms-step',
  templateUrl: './sms-step.component.html',
  styleUrls: ['./sms-step.component.less']
})
export class SmsStepComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private service$: RegistrationService) {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  ngUnsubscribe = new Subject<void>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isLoading = false;
  public phoneForm: FormGroup;
  public codeForm: FormGroup;
  public expiringSeconds: number;
  public leftSeconds: number;
  public attempts: number;
  public _isCodeRecieved = false;
  public _error: string;
  private secondsInterval;

  private readonly ERROR_SMS_EXPIRED = 'Время действия кода истекло';
  private readonly ERROR_SMS_ATTEMPTS =
    'Количество попыток ввода израсходовано';
  private readonly ERROR_SMS_WRONG = 'Неверно введенный код';
  private readonly ERROR_SMS_INTERNAL =
    'Произошла ошибка при попытке отправить введенный код';
  private readonly ERROR_SMS_NOT_ALLOWED =
    'Вы ввели неверный код, либо он более не действителен';

  set isCodeRecieved(value: boolean) {
    this._isCodeRecieved = value;
    if (!this.isCodeRecieved) {
      // this.error = '';
    }
  }

  get isCodeRecieved(): boolean {
    // return this._isCodeRecieved;
    const isRecieved = this.service$.getSmsState();
    if (this.service$.isInit() || this.service$.getSmsState()) {
      // this.error = '';
    }
    return isRecieved;
  }

  set error(value: string) {
    if (value) {
      this.phoneForm.reset();
    }
    this._error = value;
  }

  get error(): string {
    return this._error;
  }

  ngOnInit() {
    if (!this.service$.getSmsState()) {
      this.service$.setSmsState(this.service$.SMS_STATE_INIT);
    }
    this.service$.behaviorSmsError
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((error: HttpErrorResponse) => {
        console.log(error);
        if (error) {
          if (error.status === 400) {
            this.error = this.ERROR_SMS_NOT_ALLOWED;
          } else {
            this.error = this.ERROR_SMS_INTERNAL;
          }
        }
      });
    // this.isCodeRecieved = this.service$.getSmsState();
    this.leftSeconds = this.service$.getExpiringSeconds();
    this.attempts = this.service$.getAttempts();
    if (!this.leftSeconds || this.leftSeconds < 0) {
      this.service$.setSmsState(this.service$.SMS_STATE_INIT);
      // this.isCodeRecieved = this.service$.getSmsState();
    } else {
      if (!this.attempts || this.attempts < 0) {
        this.error = this.ERROR_SMS_ATTEMPTS;
      }
      this.setTimer();
    }
    this.phoneForm.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {
        if (this.error) {
          this.error = '';
        }
      });
  }

  update() {
    clearInterval(this.secondsInterval);
    // this.isCodeRecieved = this.service$.getSmsState();
  }

  getCode(event) {
    this.codeForm.reset();
    this.service$.setSmsState(this.service$.SMS_STATE_INIT);
    // this.isCodeRecieved = this.service$.getSmsState();
    this.isLoading = true;
    this.service$
      .getCode(this.phoneForm.value.phoneNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: SmsResponse) => {
          const seconds = new Date(data.expiration).getTime();
          if (data.expiration) {
            this.service$.setExpiringSeconds(seconds);
            this.leftSeconds = this.service$.getExpiringSeconds();
            this.setTimer();
          }
          this.attempts = data.attempts;
          this.service$.setAttempts(this.attempts);
          // this.isCodeRecieved = true;
          this.service$.setSmsState(this.service$.SMS_STATE_RECIEVED);
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
        }
      );
  }

  sendCode(event) {
    if (this.attempts) {
      this.attempts--;
      this.service$.setAttempts(this.attempts);
      this.attempts = 4;
      if (this.attempts < 1) {
        this.service$.setSmsState(this.service$.SMS_STATE_ATTEMPTS_WASTED);
        this.update();
        this.error = this.ERROR_SMS_ATTEMPTS;
      } else {
        this.isLoading = true;
        this.service$
          .sendCode(+this.codeForm.value.code)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (response: any) => {
              if (response.correct) {
                this.isLoading = false;
                this.update();
                this.onNavigate.emit(true);
              } else {
                this.isLoading = false;
                this.error = this.ERROR_SMS_NOT_ALLOWED;
              }
            },
            err => console.log(err)
          );
        // }, (error: any) => {
        //   console.log(error);
        //   this.isLoading = false;
        //   if (error.code === 400) {
        //     this.error = this.ERROR_SMS_WRONG;
        //     console.log(error);
        //   } else {
        //     this.error = this.ERROR_SMS_INTERNAL;
        //   }
        // });

      }
    }
  }

  setTimer() {
    clearInterval(this.secondsInterval);
    this.secondsInterval = setInterval(() => {
      if (this.leftSeconds > 0) {
        this.leftSeconds -= 1;
      } else {
        this.service$.setSmsState(this.service$.SMS_STATE_EXPIRED);
        this.update();
        this.error = this.ERROR_SMS_EXPIRED;
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
