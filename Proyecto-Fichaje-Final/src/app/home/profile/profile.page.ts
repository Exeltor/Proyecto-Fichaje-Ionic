import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController, Platform } from '@ionic/angular';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { Observable } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { PushNotificationsService } from '../../services/push-notifications.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  admin = true;
  empresa: Observable<any>;
  constructor(public authService: AuthService, private modalController: ModalController, private afs: AngularFirestore, private pushNotifications: PushNotificationsService, private platform: Platform) { }

  ngOnInit() {
    this.empresa = this.authService.user.pipe(switchMap(user=>{
      return this.afs.doc(
        `empresas/` + user.empresa
      ).valueChanges();
    }))

    this.pushNotifications.getToken();

    
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
          'telefono': user.telefono,
          'country': user.countryCode,
          'latPersona': user.localizacionCasa.lat,
          'lonPersona': user.localizacionCasa.lon
        }
      }).then(modalEl => {
        modalEl.present();
      });
    });
    
  }

}
