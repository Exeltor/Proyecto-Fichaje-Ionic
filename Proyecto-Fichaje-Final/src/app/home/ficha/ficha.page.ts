import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FichajeService } from './fichaje.service';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.page.html',
  styleUrls: ['./ficha.page.scss'],
})
export class FichaPage implements OnInit {
  time: Date = new Date();
  timeInterval;

  constructor(private authService: AuthService, private fichajeService: FichajeService) { }

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
        this.time.setSeconds(this.time.getSeconds() + 1);
      }, 1000);
      console.log('Interval started');
    }
  }

  startWorkDay() {
    this.fichajeService.startWorkDay();
  }



}
