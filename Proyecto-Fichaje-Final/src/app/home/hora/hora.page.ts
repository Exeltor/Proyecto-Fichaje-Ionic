import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { UinfoPage } from './uinfo/uinfo.page';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  // Observable con la coleccion de usuarios de la base de datos
  fireList;
  empresa: Observable<any>;
  constructor(public authService: AuthService, public afs: AngularFirestore, public modalCtrl: ModalController) {
    this.fireList = this.authService.user.pipe(switchMap(user => {
      return this.afs.collection(
       `users`, ref => ref.where('empresa', '==', user.empresa)
      ).valueChanges();
    }));
  }

  async presentModal(nombre, telefono, dni, horasDiarias) {
    const modal = await this.modalCtrl.create({
      component: UinfoPage,
      componentProps: {
        nombreU : nombre,
        telf: telefono,
        DNI: dni,
        horasD: horasDiarias
      }
    });
    return await modal.present();
  }

  ngOnInit() {
   this.empresa = this.authService.user.pipe(switchMap(user=>{
    return this.afs.doc(
      `empresas/` + user.empresa
    ).valueChanges();
  }))
  }

  // Metodo al que se le entrega como parametro el usuario a borrar de la coleccion
  borrarUsuario(user) {
    this.afs.doc('users/' + user).delete();
  }
}
