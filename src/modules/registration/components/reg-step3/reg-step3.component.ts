import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { RegistrationService } from '../../registration.service';

@Component({
  selector: 'app-reg-step3',
  templateUrl: './reg-step3.component.html',
  styleUrls: ['./reg-step3.component.less']
})
export class RegStep3Component implements OnInit {
  constructor(
    public $service: RegistrationService
  ) {
    this.form = $service.registrationPassportForm;
  }

  public form: FormGroup;
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  back(e) {
    this.onNavigate.emit(false);
  }

  skip(e) {
    this.onNavigate.emit(true);
  }

  submitForm(event) {
    console.log(this.form.value);
    this.onNavigate.emit(true);
  }
}
