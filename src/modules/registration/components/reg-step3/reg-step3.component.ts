import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../../registration.service';
// import { BaseModel, BaseResponse } from '../../lib';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import { BaseResponse, BaseModel, ContentType } from 'angular-kladr';

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
  public cities: Observable<BaseResponse>;
  public streets: Observable<BaseResponse>;
  public buildings: Observable<BaseResponse>;

  private selectedRegion: BaseModel | string;
  private selectedStreet: BaseModel | string;
  public form: FormGroup;
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    this.subscribeKladr();
  }

  subscribeKladr() {
    const DEBOUNCE_TIME = this.service$.DEBOUNCE_TIME;
    this.regions = this.form.get('region').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          const arr = typeof value === 'string' ? value.split(/[^A-Za-zА-Яа-я]/i) : null;
          value = arr && arr.length > 1 ? arr[arr.length - 1] : value;
          this.selectedRegion = value;
          return this.service$.getRegions(value);
        })
      );
    this.findInResponse(this.regions, 'region', 'locality');
    this.cities = this.form.get('locality').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          const region = this.form.get('region').value;
          if (region.id) {
            return this.service$.getCities(value, region.id ? region.id : null);
          } else {
            this.setError('locality');
          }
        })
      );
    this.findInResponse(this.cities, 'locality', 'street');
    this.streets = this.form.get('street').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          const arr = typeof value === 'string' ? value.split(/[^A-Za-zА-Яа-я]/i) : null;
          value = arr && arr.length > 1 ? arr[arr.length - 1] : value;
          this.selectedStreet = value;
          const city = this.form.get('locality').value;
          if (city.id) {
            return this.service$.getStreets(value, city.id);
          } else {
            this.setError('street');
          }
        })
      );
    this.findInResponse(this.streets, 'street', 'buildingNumber');
    this.buildings = this.form.get('buildingNumber').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(DEBOUNCE_TIME),
        switchMap(value => {
          const street = this.form.get('street').value;
          if (street.id) {
            return this.service$.getBuildings(value, street.id);
          } else {
            this.setError('buildingNumber');
          }
        })
      );
    this.findInResponse(this.buildings, 'buildingNumber', null);
  }

  setError(control: string) {
    this.form.get(control).setErrors({
      notExist: true
    });
  }

  findInResponse(list: Observable<BaseResponse>, controlName: string, childName: string) {
    const control = this.form.get(controlName);
    const child = this.form.get(childName);
    list
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((response: BaseResponse) => {
        if (typeof child !== 'undefined' && child && child.value) {
          switch (childName) {
            case 'region':
              child.setValue(null);
              this.form.get('street').setValue(null);
              this.form.get('buildingNumber').setValue(null);
              break;
            case 'locality':
              child.setValue(null);
              this.form.get('buildingNumber').setValue(null);
              break;
            case 'street':
              child.setValue(null);
              break;
            default:
              break;
          }
          this.form.get('apartment').setValue(null);
        }
        if (typeof control.value === 'string') { // если человек еще вводит, не нажав на предложенный список
          // tslint:disable-next-line:max-line-length
          if (response.searchContext.contentType === ContentType.building) { // если дома, то можно выбрать первый совпадающий полностью номер
            const found = response.result.find(x => x.name === control.value); // ищем, есть ли совпадение
            if (found) { // ура, нашли, можно присвоить
              control.setValue(found);
              return;
            }
          }
          if (response.result.length === 1) { // если остался один результат
            const selected = response.result[0];
            if (selected.contentType === ContentType.region || selected.contentType === ContentType.street) {
              selected.name = `${selected.type} ${selected.name}`;
            }
            control.setValue(selected);
          } else if (response.result.length === 0) { // ввел несуществующий элемент
            control.setErrors({
              notExist: true
            }); // ошибка, такого не существует
          }
        }
      });
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
