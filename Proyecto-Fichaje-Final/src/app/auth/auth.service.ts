import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  uid: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  surname: string;
  horasEntradaSalida: Date[];
  puestoTrabajo: string;
  DNI: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(val => {
      console.log(val, "Funciona");
      this.router.navigateByUrl('/home');

    }).catch(err => {
      console.log(err, "No funciona");
    })
  }

  signUp(email: string, password: string){
    
  }
}
