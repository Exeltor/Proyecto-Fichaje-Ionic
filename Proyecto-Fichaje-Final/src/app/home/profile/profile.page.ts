import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

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

  // Apertura modal para introduccion de datos de la persona a registrar
  registerUser() {
    this.modalController.create({
      component: RegisterUserModalComponent,
    }).then(modalEl => {
      modalEl.present();
    });
  }

  editProfile() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.modalController.create({
        component: EditUserModalComponent,
        componentProps: {
          'nombre': user.nombre,
          'DNI': user.DNI,
          'email':  this.authService.getUserEmail(),
          'telefono': user.telefono
        }
      }).then(modalEl => {
        modalEl.present();
      });
    });
    
  }

}
