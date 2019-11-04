import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.page.html',
  styleUrls: ['./ficha.page.scss'],
})
export class FichaPage implements OnInit {
  time: Date;
  timeInterval;

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  // Closing time interval after leaving the page to save resources
  ionViewWillLeave() {
    if (this.timeInterval) {
      this.timeInterval = null;
    }
    console.log('paused interval');
  }

  // Initializing time interval when entering the page
  ionViewDidEnter() {
    this.time = new Date();
    if (!this.timeInterval) {
      this.timeInterval = setInterval(() => {
        this.time = new Date();
      }, 1000);
      console.log('Interval started');
    }
  }



}
