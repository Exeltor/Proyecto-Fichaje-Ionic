import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  // Observable con la coleccion de usuarios de la base de datos
  fireList;

  constructor(public authService: AuthService, public afs: AngularFirestore) {
    this.fireList = this.authService.user.pipe(switchMap(user => {
      return this.afs.collection(
        `users`, ref => ref.where('Nombre_Empresa', '==', user.Nombre_Empresa)
      ).valueChanges();
    }));
  }



  ngOnInit() {
  }

  // Metodo al que se le entrega como parametro el usuario a borrar de la coleccion
  borrarUsuario(user) {
    this.afs.doc('users/' + user).delete();
  }
}
