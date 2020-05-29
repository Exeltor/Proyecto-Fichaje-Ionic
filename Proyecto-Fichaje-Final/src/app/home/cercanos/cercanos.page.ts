import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: 'app-cercanos',
  templateUrl: './cercanos.page.html',
  styleUrls: ['./cercanos.page.scss'],
})
export class CercanosPage implements OnInit {
  listaWorkers = [];
  fireList;
  empresa: Observable<any>;
  photoUrl;
  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public modalCtrl: ModalController,
    private storage: AngularFireStorage
  ) {
    this.fireList = this.authService.user.pipe(
      switchMap(user => {
        const ref = this.storage.ref(`profile/${user.uid}`);
        this.photoUrl = ref.getDownloadURL().toPromise();
        return this.afs
          .collection(`users`, ref => ref.where("empresa", "==", user.empresa))
          .valueChanges();
      })
    );
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

  destLat;
  destLon;
  usuarioSelec(lat , lon){
    this.destLat = lat;
    this.destLon = lon;
  }

  borrarUsuario(user) {
    this.afs.doc("users/" + user).delete();
  }

}
