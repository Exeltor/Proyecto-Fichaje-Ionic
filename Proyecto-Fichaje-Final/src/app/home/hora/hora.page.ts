import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  // Observable con la coleccion de usuarios de la base de datos
  fireList: Observable<any> = this.afs.collection(
    `users`
  ).valueChanges();

  constructor(public authService: AuthService, public afs: AngularFirestore) { }


  ngOnInit() {
  }

  // Metodo al que se le entrega como parametro el usuario a borrar de la coleccion
  borrarUsuario(user) {
    //this.afs.collection('users').doc(user).delete();
    this.afs.doc('users/' + user).delete(); // Hace falta especificar??¿¿
  }
}
