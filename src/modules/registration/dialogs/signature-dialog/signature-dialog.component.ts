import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SignaturePadComponent } from 'angular-signature-pad/src/components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.less']
})
export class SignatureDialogComponent implements OnInit {

  constructor() { }
  @ViewChild('sP') signaturePad: SignaturePadComponent;

  ngOnInit() {
  }

  close(){

  }

  save(){
    console.log(this.signaturePad)
  }
}
