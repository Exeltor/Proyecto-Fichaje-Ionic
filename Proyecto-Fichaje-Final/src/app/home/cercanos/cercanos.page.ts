import { Component, OnInit } from "@angular/core";
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

    // Observable con la coleccion de usuarios de la base de datos
    listaWorkers = [];
    fireList;
    empresa: Observable<any>;
    photoUrl;
    hacialat=0;
    hacialon=0;
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
    changeDestino(lat, lon){
      this.hacialat = lat;
      this.hacialon = lon;
    }
}
