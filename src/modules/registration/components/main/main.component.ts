import { Component, OnInit } from '@angular/core';
import { LocationState, State, LocationStateService } from '../../lib';
import { RegistrationService } from '../../registration.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  constructor(
    public location: LocationStateService,
    public $service: RegistrationService
  ) { }

  isFilled = false;

  ngOnInit() {
    console.log(this.location.currentLocation);
  }

  navigate(e: boolean) {
    if (this.location.currentLocation.step1) {
      this.location.navigate(1);
      this.isFilled = e;
      return;
    }
    this.location.navigate(e ? 1 : -1);
  }

}
