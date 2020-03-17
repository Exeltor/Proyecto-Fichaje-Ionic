import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController, Platform } from '@ionic/angular';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditBusinessModalComponent } from './edit-business-modal/edit-business-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { User } from 'src/app/models/user.model';
import { Empresa } from 'src/app/models/empresa.model'
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

  editBusiness() {
   this.empresa.pipe(take(1)).subscribe(empresa => {
      this.modalController.create({
        component: EditBusinessModalComponent,
        componentProps: {
          'Nombre': empresa.Nombre,
          'CIF': empresa.id,
          'loc1':  empresa.loc[0],
          'loc2': empresa.loc[1]
        }
      }).then(modalEl => {  
        modalEl.present();
      });
    });
  }


}
