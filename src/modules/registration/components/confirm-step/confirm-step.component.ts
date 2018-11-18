import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SignatureDialogComponent } from '../../dialogs';
import { ModalDialogService } from 'ngx-modal-dialog';

@Component({
  selector: 'app-confirm-step',
  templateUrl: './confirm-step.component.html',
  styleUrls: ['./confirm-step.component.less']
})
export class ConfirmStepComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) { }

  isDialogOpened = false;
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
  get enabled() {
    return this.agreed && !!this.imageData;
  }
  pdfSrc = 'assets/agreement.pdf';

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
    // const dialogConfig: MatDialogConfig = {
    //   closeOnNavigation: true,
    //   autoFocus: false,
    //   panelClass: 'signature-dialog'
    // };
    // const dialogref = this.dialog.open(SignatureDialogComponent, dialogConfig);
    // dialogref.afterClosed().subscribe(data => {
    //   if (!data) {
    //     this.agreed = false;
    //   }
    //   this.imageData = data;
    // });
    // this.modalService.openDialog(this.viewRef, {
    //   title: 'Some modal title',
    //   childComponent: SignatureDialogComponent
    // });
    this.isDialogOpened = true;
  }

  onDialogClose(data) {
    if (!data) {
      this.agreed = false;
    }
    this.imageData = data;
    this.isDialogOpened = false;
    console.log(data);
  }
}
