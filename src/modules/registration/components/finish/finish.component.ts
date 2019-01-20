import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QRCODE_STATE_KEY } from '../../registration.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.less']
})
export class FinishComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  finish(e: boolean) {
    const token = this.activatedRoute.snapshot.data['token'];
    localStorage.setItem(QRCODE_STATE_KEY, '1');
    this.router.navigate(['/' + token]);
    // alert('returned');
  }
}
