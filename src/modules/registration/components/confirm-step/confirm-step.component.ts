import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-step',
  templateUrl: './confirm-step.component.html',
  styleUrls: ['./confirm-step.component.less']
})
export class ConfirmStepComponent implements OnInit {

  constructor() { }

  pdfSrc = 'assets/ece_DH_actual_12.09.17 (1).pdf';

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  next(e: boolean) {
    this.onNavigate.emit(true);
  }

  back(e: boolean) {
    this.onNavigate.emit(false);
  }

}
