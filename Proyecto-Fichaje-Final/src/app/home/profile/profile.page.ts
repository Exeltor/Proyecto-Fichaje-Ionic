import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditBusinessModalComponent } from './edit-business-modal/edit-business-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { Horario } from '../../models/horario.model'
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
  horario: Observable<any>
  constructor(public authService: AuthService, private modalController: ModalController, private pushNotifications: PushNotificationsService, private afs: AngularFirestore) { }


  ngOnInit() {
    this.pushNotifications.getToken();
    this.horario = this.authService.user.pipe(
      switchMap(user=>{
        return this.afs.doc<Horario>(`empresas/${user.empresa}/horarios/${user.horario}`).valueChanges();
      })
    )

  }

  // Apertura modal para introduccion de datos de la persona a registrar
  registerUser() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.modalController.create({
        component: RegisterUserModalComponent,
        componentProps: {
          'empresaCode': user.empresa
        }
        }).then(modalEl => {
          modalEl.present();
        });
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
          'horarioCode': user.horario,
          'empresaCode': user.empresa,
          'latPersona': user.localizacionCasa.lat,
          'lonPersona': user.localizacionCasa.lon
        }
      }).then(modalEl => {
        modalEl.present();
      });
    });
    
  }

  editBusiness() {
   this.authService.empresa.pipe(take(1)).subscribe(empresa => {
      this.modalController.create({
        component: EditBusinessModalComponent,
        componentProps: {
          'Nombre': empresa.Nombre,
          'CIF': empresa.id,
          'latEmpresa':  empresa.loc[0],
          'lonEmpresa': empresa.loc[1],
          'distancia': empresa.distancia
        }
      }).then(modalEl => {  
        modalEl.present();
      });
    });
  }


}
