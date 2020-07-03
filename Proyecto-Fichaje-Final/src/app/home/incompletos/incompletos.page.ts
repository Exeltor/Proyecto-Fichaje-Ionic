import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { switchMap,take } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { AngularFireStorage } from "@angular/fire/storage";
import { EditUserModalComponent } from "./edit-user-modal/edit-user-modal.component";
import { async } from '@angular/core/testing';
import { workers } from 'cluster';
@Component({
  selector: "app-incompletos",
  templateUrl: "./incompletos.page.html",
  styleUrls: ["./incompletos.page.scss"]
})
export class IncompletosPage implements OnInit {
  // Observable con la coleccion de usuarios de la base de datos
  listaWorkers = [];
  fireList;
  empresa: Observable<any>;
  navCtrl: any;
  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public modalCtrl: ModalController,
    private storage: AngularFireStorage,
    private modalController: ModalController,
    private zone: NgZone
  ) {
    this.fireList = this.authService.user.pipe(
      switchMap(user => {
        return this.afs
          .collection(`users`, ref => ref.where("empresa", "==", user.empresa))
          .valueChanges();
      })
    );
  }


  refresh(): void {
    window.location.reload();
}

  editProfile() {
    this.authService.user.pipe().subscribe(user => {
      this.modalController
        .create({
          component: EditUserModalComponent,
          componentProps: {
            nombre: user.nombre,
            DNI: user.DNI,
            email: this.authService.getUserEmail(),
            telefono: user.telefono,
            country: user.countryCode,
            horarioCode: user.horario,
            empresaCode: user.empresa,
            latPersona: user.localizacionCasa.lat,
            lonPersona: user.localizacionCasa.lon
          }
        })
        .then(modalEl => {
          modalEl.present();
        });
    });
  }

  async presentModal(
    uid,
    nombre,
    empresaCode,
    horarioCode,
    dni,
    telefono,
    photoURL,
    email,
    latPersona,
    lonPersona,
    country
  ) {
    this.modalCtrl
      .create({
        component: EditUserModalComponent,
        componentProps: {
          uid,
          nombre,
          empresaCode,
          horarioCode,
          dni,
          telefono,
          photoURL,
          email,
          latPersona,
          lonPersona,
          country

        }
      })
      .then(modal => {
        modal.present();
        modal.onDidDismiss().then(() => {
          this.ionViewWillEnter();
        });
      });
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
        if(workers[i].DNI == null){
          this.listaWorkers.push(workers[i]);
        }
      }
    });
  }
  // Metodo al que se le entrega como parametro el usuario a borrar de la coleccion
  borrarUsuario(user) {
    this.afs.doc("users/" + user).delete();
  }
}
