import { Component, OnInit } from '@angular/core';
import { LocationStateService } from '../../../registration/lib';
import { QRCODE_STATE_KEY } from '../../../registration/registration.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor(
    private location$: LocationStateService
  ) { }

  video;
  poster;
  isInitialized = false;
  qrcode = false;

  ngOnInit() {
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
