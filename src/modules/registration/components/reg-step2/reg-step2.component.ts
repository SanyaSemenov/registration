import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../../registration.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reg-step2',
  templateUrl: './reg-step2.component.html',
  styleUrls: ['./reg-step2.component.less']
})
export class RegStep2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    public service$: RegistrationService
  ) {
    this.form = service$.mainPassportForm;
  }

  showPassportMaskType = false;
  showissuerCodeaskType = false;
  ngUnsubscribe = new Subject<void>();

  get heading() {
    return this.isFilled ? 'Проверьте распознанные данные вашего паспорта' : 'Введите ваши паспортные данные';
  }
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  isFilled: boolean;

  public form: FormGroup;
  genderList = [
    { value: 'муж', viewValue: 'муж' },
    { value: 'жен', viewValue: 'жен' }
  ];
  ngOnInit() {
    if (this.isFilled) {
      if (this.service$.recognitionError) {
        this.isFilled = false;
        alert('Не удалось распонать данные паспорта');
      }
    } else {
      this.service$.clearMainPassportForm();
      this.form.reset();
    }
  }

  back(e) {
    this.onNavigate.emit(false);
  }

  submitForm(event) {
    console.log(this.form.value);
    this.onNavigate.emit(true);
  }
}
