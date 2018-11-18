import { Injectable } from '@angular/core';
import { LocationState, State } from './location-state.model';
import { RegistrationService } from '../registration.service';

const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE_KEY';

@Injectable({
  providedIn: 'root'
})
export class LocationStateService {
  constructor(
    private service$: RegistrationService
  ) {
    this.updateLocation(false);
  }
  private location: LocationState;

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
    this.service$.setSmsState(this.service$.SMS_STATE_INIT);
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
