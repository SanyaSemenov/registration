import { Component, OnInit } from '@angular/core';
import { LocationStateService } from 'src/modules/registration/lib';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor(
    private location: LocationStateService
  ) { }

  video;
  poster;
  isInitialized = false;
  qrcode = false;

  ngOnInit() {
    this.checkForQr();
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

  private checkForQr(){
    const received = localStorage.getItem('qrcode:received');
    if (received === '1') {
      this.qrcode = true;
      this.location.setStart();
    } else {
      this.qrcode = false;
    }
  }

  public cancelRegistration(e){
    localStorage.setItem('qrcode:received', '0');
    this.checkForQr();
  }
}
