import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor() { }

  video;
  poster;
  isInitialized = false;
  qrcode = false;

  ngOnInit() {
    const received = localStorage.getItem('qrcode:received');
    if (received === '1') {
      this.qrcode = true;
    }
  }

  playYoutubeVideo() {
    if (!this.isInitialized) {
      this.video = document.getElementById('video_frame');
      this.poster = document.getElementById('youtube_poster');
      const currentAttribute = this.video.getAttribute('src');
      this.video.setAttribute('src', currentAttribute + '?autoplay=1');
      this.poster.classList.add('invisible');
      this.isInitialized = true;
    }
  }

}
