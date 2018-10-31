import { Component, OnInit } from '@angular/core';
import { LocationState, State, LocationStateService } from '../../lib';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  constructor(
    private location: LocationStateService
  ) { }

  preFilled = false;

  ngOnInit() {
    console.log(this.location.currentLocation);
  }

  navigate(e: boolean) {
    if (this.location.currentLocation.step1) {
      this.location.navigate(1);
      this.preFilled = e;
      return;
    }
    this.location.navigate(e ? 1 : -1);
  }

}
