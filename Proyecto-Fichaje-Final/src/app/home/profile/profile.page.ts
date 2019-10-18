import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  admin = true;

  constructor(public authService: AuthService, private modalController: ModalController) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  // Apertura modal para introduccion de datos de la persona a registrar
  registerUser() {
    this.modalController.create({
      component: RegisterUserModalComponent,
    }).then(modalEl => {
      modalEl.present();
    });
  }

}
