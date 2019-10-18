import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  registerUser(email: string, password: string) {
    this.http.post('https://us-central1-fichaje-uni.cloudfunctions.net/register', {email, password}).subscribe(response => {
      console.log(response);
    });
  }

  private setUserDoc(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      nombre: 'titan',
      DNI: '',
      admin: false,
      telefono: ''
    }
    return userRef.set(data);
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(val => {
        console.log(val, 'Funciona');
        this.router.navigateByUrl('/home');
      })
      .catch(err => {
        console.log(err.code, 'No funciona');
        let error;

        if (
          err.code === 'auth/invalid-email' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          error = 'Usuario o contraseña no validos';
        } else {
          error = err.code;
        }

        this.alertController.create({
          header: 'No se pudo iniciar sesion',
          message: error,
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel'
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then(val => {
        console.log('Logged out');
        this.router.navigateByUrl('auth');
      })
      .catch(err => {
        console.log('Cannot log out');
      });
  }
}
