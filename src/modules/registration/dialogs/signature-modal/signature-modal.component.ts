import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.less']
})
export class SignatureModalComponent implements OnInit, AfterViewInit {

  constructor() { }
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('title') title: ElementRef;

  @Input()
  set open(value) {
    this.isOpened = value;
  }

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onClose = new EventEmitter<any>();

  private result: any;
  public dirty = false;
  public isOpened = false;

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
    const result = windowHeight * 3 / 4 - 200;
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
    // this.dialogRef.close();
    this.signaturePad.clear();
    this.onClose.emit();
    this.isOpened = false;
  }

  save() {
    if (this.dirty) {
      // this.dialogRef.close(this.result);
      this.signaturePad.clear();
      this.onClose.emit(this.result);
      this.isOpened = false;
    }
  }
}
