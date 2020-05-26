import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import { ModalController } from 'ionic-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
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
  abrirGeneradorFichaje(){
    // this.modal.create();
  }
}
