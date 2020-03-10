import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    
  }

  initializeApp() {
  }

  onLogout() {
    this.authService.logout();
  }
}
