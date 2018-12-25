import { Injectable } from '@angular/core';
import { LocationState, State } from './location-state.model';
import { RegistrationService } from '../registration.service';
import { BehaviorSubject } from 'rxjs';

const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE_KEY';

@Injectable({
  providedIn: 'root'
})
export class LocationStateService {
  constructor() {
    this.updateLocation(false);
  }
  private location: LocationState;
  public onInit = new BehaviorSubject<boolean>(false);

  public updateLocation(isInit: boolean) {
    if (isInit) {
      this.init();
    }
    const location = Number(localStorage.getItem(NAVIGATION_STATE_KEY));
    if (Number.isNaN(location) || !location) {
      this.init();
    } else {
      this.location = new LocationState(location);
    }
  }

  private init() {
    this.onInit.next(true);

    this.location = new LocationState(State.sms);
    localStorage.setItem(NAVIGATION_STATE_KEY, this.currentLocation.state.toString());
  }

  public navigate(step): void {
    this.location.switchState(step);
    localStorage.setItem(NAVIGATION_STATE_KEY, this.currentLocation.state.toString());
  }

  get currentLocation(): LocationState {
    return this.location;
  }
}
