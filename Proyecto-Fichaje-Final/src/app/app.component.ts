import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ValidateBusinessModalComponent } from './validate-business-modal/validate-business-modal.component';
import { ModalController } from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService, 
    private modalController: ModalController
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

  validarEmpresa() {
    this.modalController.create({
      component: ValidateBusinessModalComponent,
    }).then(modalEl => {
      modalEl.present();
    });
  }
}
