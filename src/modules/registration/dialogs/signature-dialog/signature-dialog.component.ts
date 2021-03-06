import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.less']
})
export class SignatureDialogComponent implements OnInit, AfterViewInit {

  constructor(
    private dialogRef: MatDialogRef<SignatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('title') title: ElementRef;

  private result: any;
  public dirty = false;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 0.1,
    'maxWidth': 2,
    'penColor': '#1E44FD'
  };

  ngOnInit() {
  }

  ngAfterViewInit() {
    const titleWidth = this.title.nativeElement.offsetWidth;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const result = windowWidth / windowHeight > 1 ? windowHeight * 9 / 10 - 200 : windowWidth * 9 / 10;
    console.log(titleWidth);
    this.signaturePad.set('minWidth', 0.1);
    this.signaturePad.set('maxWidth', 2);
    this.signaturePad.set('canvasWidth', titleWidth);
    this.signaturePad.set('canvasHeight', result);
    this.signaturePad.clear();
  }

  drawComplete() {
    this.result = this.signaturePad.toDataURL();
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    this.dirty = true;
    console.log('begin drawing');
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.dirty) {
      this.dialogRef.close(this.result);
    }
  }
}
