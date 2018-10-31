import { Injectable } from '@angular/core';
import { LocationState, State } from './location-state.model';

@Injectable({
  providedIn: 'root'
})
export class LocationStateService {
  constructor() {
    this.location = new LocationState(State.step1);
  }
  private location: LocationState;

  public navigate(step): void {
    this.location.switchState(step);
  }

  get currentLocation(): LocationState {
    return this.location;
  }
}
