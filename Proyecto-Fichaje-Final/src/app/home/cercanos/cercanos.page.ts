import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { AngularFireStorage } from "@angular/fire/storage";
import { UinfoPage } from "src/app/home/trabajadores/uinfo/uinfo.page";
import { User } from 'firebase';

@Component({
  selector: 'app-cercanos',
  templateUrl: './cercanos.page.html',
  styleUrls: ['./cercanos.page.scss'],
})
export class CercanosPage implements OnInit {
  listaWorkers = [];
  fireList;
  empresa: Observable<any>;
  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public modalCtrl: ModalController,
    private storage: AngularFireStorage
  ) {
    this.fireList = this.authService.user.pipe(
      switchMap(user => {
        return this.afs
          .collection(`users`, ref => ref.where("empresa", "==", user.empresa))
          .valueChanges();
      })
    );
  }

  async presentModal(
    uid,
    nombre,
    empresaCode,
    horarioCode,
    dni,
    telefono,
    photoURL
  ) {
    this.modalCtrl
      .create({
        component: UinfoPage,
        componentProps: {
          uid,
          nombre,
          empresaCode,
          horarioCode,
          dni,
          telefono,
          photoURL
        }
      })
      .then(modal => {
        modal.present();
        modal.onDidDismiss().then(() => {
          this.ionViewWillEnter();
        });
      });
  }

  UserSelectLat: any;
  UserSelectLon: any;
  escribirNombre(lat,lon){
    this.UserSelectLat = lat;
    this.UserSelectLon = lon;
  }

  ngOnInit() {
    this.empresa = this.authService.user.pipe(
      switchMap(user => {
        return this.afs.doc(`empresas/` + user.empresa).valueChanges();
      })
    );
  }

  ionViewWillEnter() {
    this.fireList.forEach(workers => {
      this.listaWorkers = [];
      for (let i = 0; i < workers.length; i++) {
        const ref = this.storage.ref(`profile/${workers[i].uid}`);
        workers[i].photoUrl = ref.getDownloadURL().toPromise();
        this.listaWorkers.push(workers[i]);
      }
    });
  }
}
