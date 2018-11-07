import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../../registration.service';
import { MainPassportData } from '../../lib';
import { M } from 'materialize-css';

@Component({
  selector: 'app-reg-step2',
  templateUrl: './reg-step2.component.html',
  styleUrls: ['./reg-step2.component.less']
})
export class RegStep2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private $service: RegistrationService
  ) {
    this.form = $service.mainPassportForm;
  }

  showPassportMaskType = false;
  showPassportCodeaskType = false;

  get heading() {
    return this.isFilled ? 'Проверьте распознанные данные вашего паспорта' : 'Введите ваши паспортные данные';
  }
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  isFilled: boolean;

  form: FormGroup;
  genderList = [
    { value: 'муж', viewValue: 'муж' },
    { value: 'жен', viewValue: 'жен' }
  ];
  ngOnInit() {
    if (this.isFilled) {
      if (!this.$service.mainPassportDataFilled) {
        this.$service.getMainRecognizedData().subscribe((data: MainPassportData) => {
          this.form.patchValue(data);
        });
      }
    } else {
      this.$service.clearMainPassportForm();
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
