import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../../registration.service';
import { BaseModel, BaseResponse } from '../../lib';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reg-step3',
  templateUrl: './reg-step3.component.html',
  styleUrls: ['./reg-step3.component.less']
})
export class RegStep3Component implements OnInit {
  constructor(
    public service$: RegistrationService
  ) {
    this.form = service$.registrationPassportForm;
  }
  private ngUnsubscribe = new Subject<void>();
  public regions: Observable<BaseResponse>;
  public selectedRegion: BaseModel;
  public cities: Observable<BaseResponse>;
  // public region: FormControl;
  public form: FormGroup;
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    // this.service$.getRegions('')
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     debounceTime(300),
    //     switchMap(value => this.service$.get)
    //   )
    //   .subscribe((data: BaseResponse) => {
    //     this.regions = data.result;
    //   });
    const DEBOUNCE_TIME = this.service$.DEBOUNCE_TIME;
    this.regions = this.form.get('region').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          return this.service$.getRegions(value);
        })
      );
    this.cities = this.form.get('city').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          return this.service$.getCities(value, 0);
        })
      );
  }

  displayFn(item: BaseModel) {
    if (item) {
      return item.name;
    }
  }

  back(e) {
    this.onNavigate.emit(false);
  }

  skip(e) {
    this.onNavigate.emit(true);
  }

  public onValueChange(data) {
    console.log(data);
  }

  submitForm(event) {
    console.log(this.form.value);
    this.onNavigate.emit(true);
  }
}
