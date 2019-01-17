import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStateService } from '../../lib';
import { RegistrationService } from '../../registration.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(
    public location: LocationStateService,
    public service$: RegistrationService,
    private route: ActivatedRoute
  ) { }

  isFilled = false;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit() {
    this.location.onInit
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        if (data === true) {
          this.service$.setSmsState(this.service$.SMS_STATE_INIT);
        }
      });
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
