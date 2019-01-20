import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { LocationStateService } from '../../lib';
import { RegistrationService } from '../../registration.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { API_CONFIG, ApiInjection, REMOTE_API } from 'src/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(
    public location: LocationStateService,
    public service$: RegistrationService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    @Inject(API_CONFIG) config: BehaviorSubject<ApiInjection>
  ) {
    const decoded = this.activatedRoute.snapshot.data['decoded'];
    if(decoded) {
      config.next(REMOTE_API);
    }
  }

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
