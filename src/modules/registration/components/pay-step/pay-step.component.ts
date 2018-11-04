import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RegistrationService } from '../../registration.service';

@Component({
  selector: 'app-pay-step',
  templateUrl: './pay-step.component.html',
  styleUrls: ['./pay-step.component.less']
})
export class PayStepComponent implements OnInit {

  constructor(
    private $service: RegistrationService
  ) {
    this.$service.getPaymentAmount().subscribe((data) => {
      this.amount = data;
    });
  }

  amount: number;

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  back(e: boolean) {
    this.onNavigate.emit(false);
  }

  next(e: boolean) {
    this.onNavigate.emit(true);
  }
}
