import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/auth/auth.service";
import { switchMap, take } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-cercanos",
  templateUrl: "./cercanos.page.html",
  styleUrls: ["./cercanos.page.scss"],
})
export class CercanosPage implements OnInit {
  selectedUser: any;
  userObservable: Observable<User>;
  fireList;
  listaWorkers;
  empresa;
  userPhoto;

  constructor(
    private afs: AngularFirestore,
    public authService: AuthService,
    private storage: AngularFireStorage
  ) {
    this.fireList = this.authService.user.pipe(
      switchMap((user) => {
        return this.afs
          .collection(`users`, (ref) =>
            ref.where("empresa", "==", user.empresa)
          )
          .valueChanges();
      })
    );
  }

  async ngOnInit() {
    this.empresa = this.authService.user.pipe(
      switchMap((user) => {
        return this.afs.doc(`empresas/` + user.empresa).valueChanges();
      })
    );
    const ref = this.storage.ref(`profile/${this.authService.afAuth.auth.currentUser.uid}`);
    this.userPhoto = await ref.getDownloadURL().toPromise();
  }

  ionViewWillEnter() {
    this.fireList.forEach((workers) => {
      this.listaWorkers = [];
      for (let i = 0; i < workers.length; i++) {
        const ref = this.storage.ref(`profile/${workers[i].uid}`);
        workers[i].photoUrl = ref.getDownloadURL().toPromise().catch(e => console.log('usuario no tiene foto'));
        this.listaWorkers.push(workers[i]);
      }
    });
  }

  async selectUser(userID) {
    this.selectedUser = await this.afs.doc(`users/${userID}`).valueChanges().pipe(take(1)).toPromise();
  }
}
