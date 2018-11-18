import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit {

  @Input()
  title: string;

  @Output()
  bacdropClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  close(event) {
    this.bacdropClicked.emit();
  }
}
