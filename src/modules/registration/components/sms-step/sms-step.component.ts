import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { RegistrationService } from '../../registration.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sms-step',
  templateUrl: './sms-step.component.html',
  styleUrls: ['./sms-step.component.less']
})
export class SmsStepComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service$: RegistrationService
  ) {
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
  public error: string;
  private secondsInterval;

  private readonly ERROR_SMS_EXPIRED = 'Время действия кода истекло';
  private readonly ERROR_SMS_ATTEMPTS = 'Количество попыток ввода израсходовано';
  private readonly ERROR_SMS_WRONG = 'Неверно введенный код';
  private readonly ERROR_SMS_INTERNAL = 'Произошла ошибка при попытке отправить введенный код';

  set isCodeRecieved(value: boolean) {
    this._isCodeRecieved = value;
    if (!this.isCodeRecieved) {
      this.error = '';
    }
  }

  get isCodeRecieved(): boolean {
    // return this._isCodeRecieved;
    const isRecieved = this.service$.getSmsState();
    if (this.service$.isInit()) {
      this.error = '';
    }
    return isRecieved;
  }

  ngOnInit() {
    if (!this.service$.getSmsState()) {
      this.service$.setSmsState(this.service$.SMS_STATE_INIT);
    }
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
    // this.service$.getCode(this.phoneForm.value.phoneNumber)
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((seconds: number) => {
    //     this.expiringSeconds = seconds;
    //     this.leftSeconds = seconds;
    //     this.isCodeRecieved = true;
    //     this.service$.setSmsState(this.service$.SMS_STATE_RECIEVED);
    //     this.isLoading = false;
    //     this.setTimer();
    //   }, (error: any) => {
    //     this.isLoading = false;
    //   });
    this.service$.getCode(this.phoneForm.value.phoneNumber)
      .then(resolve => {
        // this.expiringSeconds = resolve.expiringSeconds;
        this.leftSeconds = resolve.expiringSeconds;
        this.attempts = resolve.attempts;
        this.service$.setAttempts(this.attempts);
        this.service$.setExpiringSeconds(this.leftSeconds);
        // this.isCodeRecieved = true;
        this.service$.setSmsState(this.service$.SMS_STATE_RECIEVED);
        this.isLoading = false;
        this.setTimer();
      }, reject => {
        this.isLoading = false;
      });
  }

  sendCode(event) {
    if (this.attempts) {
      this.attempts--;
      this.service$.setAttempts(this.attempts);
      if (this.attempts < 1) {
        this.service$.setSmsState(this.service$.SMS_STATE_ATTEMPTS_WASTED);
        this.update();
        this.error = this.ERROR_SMS_ATTEMPTS;
      } else {
        this.isLoading = true;
        this.service$.sendCode(this.codeForm.value.code)
          .pipe(
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((success: any) => {
            this.isLoading = false;
            this.update();
            this.onNavigate.emit(true);
          }, (error: any) => {
            this.isLoading = false;
            if (error.code === 400) {
              this.error = this.ERROR_SMS_WRONG;
            } else {
              this.error = this.ERROR_SMS_INTERNAL;
            }
          });
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
}
