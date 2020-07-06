import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { UinfoPage } from "./uinfo/uinfo.page";
import { AngularFireStorage } from "@angular/fire/storage";

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
        if(workers[i].nombre == null || 
          workers[i].telefono == null ||
          workers[i].DNI == null ||
          workers[i].horario == null 
          ){
          this.listaWorkers.push(workers[i]);
        }
       
      }
    });
  }
  // Metodo al que se le entrega como parametro el usuario a borrar de la coleccion
  borrarUsuario(user) {
    this.afs.doc("users/" + user).delete();
  }

  refresh(){
    window.location.reload();
  }
}
