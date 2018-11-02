import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SignatureDialogComponent } from '../../dialogs';

@Component({
  selector: 'app-confirm-step',
  templateUrl: './confirm-step.component.html',
  styleUrls: ['./confirm-step.component.less']
})
export class ConfirmStepComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  imageData: any;
  _agreed = false;
  get agreed() {
    return this._agreed;
  }
  set agreed(value) {
    if (this._agreed === value) {
      return;
    }
    this._agreed = value;
    if (this._agreed) {
      this.showConfirmDialog();
    }
  }
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

  showConfirmDialog() {
    const dialogConfig: MatDialogConfig = {
      closeOnNavigation: true,
      autoFocus: false
    };
    const dialogref = this.dialog.open(SignatureDialogComponent, dialogConfig);
    dialogref.afterClosed().subscribe(data => {
      this.imageData = data;
    });
  }

}
