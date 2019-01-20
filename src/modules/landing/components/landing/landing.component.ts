import { Component, OnInit, Inject } from '@angular/core';
import { LocationStateService } from '../../../registration/lib';
import { QRCODE_STATE_KEY, RegistrationService } from '../../../registration/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONFIG, ApiInjection, MOCK_API, REMOTE_API } from 'src/api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor(
    private location$: LocationStateService,
    private activatedRoute: ActivatedRoute,
    public service$: RegistrationService,
    private router: Router,
    @Inject(API_CONFIG) config: BehaviorSubject<ApiInjection>
  ) {
    this.token = activatedRoute.snapshot.data['token'];
    this.decoded = this.activatedRoute.snapshot.data['decoded'];
    if (!this.decoded) {
      console.log('api config changed');
      config.next(MOCK_API);
      this.token = '';
      this.router.navigate(['']);
      return;
    }
    config.next(REMOTE_API);
  }

  video;
  poster;
  isInitialized = false;
  qrcode = false;
  public token;
  private decoded;

  ngOnInit() {
    this.service$.setToken(this.token);
    const received = localStorage.getItem(QRCODE_STATE_KEY);
    if (received === '1') {
      this.qrcode = true;
    }
  }

  public playYoutubeVideo() {
    if (!this.isInitialized) {
      this.video = document.getElementById('video_frame');
      this.poster = document.getElementById('youtube_poster');
      const currentAttribute = this.video.getAttribute('src');
      this.video.setAttribute('src', currentAttribute + '?autoplay=1');
      this.poster.classList.add('invisible');
      this.isInitialized = true;
    }
  }

  resetRegistration() {
    this.location$.updateLocation(true);
    this.qrcode = false;
    localStorage.setItem(QRCODE_STATE_KEY, '0');
  }
}
