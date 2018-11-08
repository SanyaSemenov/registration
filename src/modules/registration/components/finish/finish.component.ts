import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStateService } from '../../lib';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.less']
})
export class FinishComponent implements OnInit {

  constructor(
    private router: Router,
    private location: LocationStateService
  ) { }

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  finish(e: boolean) {
    localStorage.setItem('qrcode:received', '1');
    this.router.navigate(['']);
    // alert('returned');
  }
}
