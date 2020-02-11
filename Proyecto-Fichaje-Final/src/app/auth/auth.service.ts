import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { auth } from 'firebase/app';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Observable<User>;
  userUid: string;
  empresa: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userUid = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUserEmail() {
    return this.afAuth.auth.currentUser.email;
  }

  registerUser(email: string, password: string, nameSurname, dni, country, tel, hours) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Creando usuario"
      })
      .then(loadingEl => {
        loadingEl.present();
        this.http
          .post("https://us-central1-fichaje-uni.cloudfunctions.net/register", {
            email,
            password,
            tel
          })
          .subscribe(
            response => {
              const jsonResponse = JSON.parse(JSON.stringify(response));
              this.setUserDoc(jsonResponse.uid, nameSurname, dni, country, tel, hours);
              console.log("usuario y documento creados");
              loadingEl.dismiss();
            },
            err => {
              const jsonError = JSON.parse(JSON.stringify(err));
              const error = jsonError.error.text;
              console.log(err);
              let errorMessage;
              if (
                error ===
                "Error: Error: The email address is already in use by another account."
              ) {
                errorMessage = "Email en uso";
              } else if (
                error ===
                "Error: Error: The user with the provided phone number already exists."
              ) {
                errorMessage = "Telefono en uso";
              } else {
                errorMessage = "Intentelo de nuevo";
              }

              loadingEl.dismiss();
              this.alertController.create({
                header: "No se ha podido crear la cuenta",
                message: errorMessage,
                buttons: [
                  {
                    role: "cancel",
                    text: "Aceptar"
                  }
                ]
              }).then(alertEl => {
                alertEl.present();
              });
            }
          );
      });
  }

  private setUserDoc(uid, nameSurname, dni,country, tel, hours) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    // TODO: Datos se rellenan por el administrador
    this.user.pipe(take(1)).subscribe(data => {
      const userDoc: User = {
        uid,
        nombre: nameSurname,
        DNI: dni,
        admin: false,
        countryCode: country,
        telefono: tel,
        empresa: data.empresa,
        horasDiarias: hours,
      };

      userRef.set(userDoc);
    });
  }

  login(email: string, password: string) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Iniciando Sesion..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.afAuth.auth
          .signInWithEmailAndPassword(email, password)
          .then(val => {
            console.log(val, "Funciona");
            loadingEl.dismiss();
            this.router.navigateByUrl("/home");
          })
          .catch(err => {
            console.log(err.code, "No funciona");
            let error;

            if (
              err.code === "auth/invalid-email" ||
              err.code === "auth/wrong-password" ||
              err.code === "auth/user-not-found"
            ) {
              error = "Usuario o contraseña no validos";
            } else {
              error = err.code;
            }

            loadingEl.dismiss();

            this.alertController
              .create({
                header: "No se pudo iniciar sesion",
                message: error,
                buttons: [
                  {
                    text: "Aceptar",
                    role: "cancel"
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          });
      });
  }

  linkWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth.currentUser.linkWithPopup(provider);
  }

  linkWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.currentUser.linkWithPopup(provider);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(val => {
      if(val.additionalUserInfo.isNewUser) {
        val.user.delete();
        this.alertController.create({
          header: 'No se ha podido iniciar sesion',
          message: 'No tiene una cuenta',
          buttons: [
            {
              text: "Aceptar",
              role: "cancel"
            }
          ]
        }).then(alert => {
          alert.present();
        })
      } else {
        this.router.navigateByUrl("/home");
      }
    });
  }

  signInWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(val => {
      if(val.additionalUserInfo.isNewUser) {
        val.user.delete();
        this.alertController.create({
          header: 'No se ha podido iniciar sesion',
          message: 'No tiene una cuenta',
          buttons: [
            {
              text: "Aceptar",
              role: "cancel"
            }
          ]
        }).then(alert => {
          alert.present();
        })
      } else {
        this.router.navigateByUrl("/home");
      }
    });
  }

  getSignInMethods() {
    return this.afAuth.auth.currentUser.providerData;
  }

  updateProfile(newData) {
    this.afs.doc(`users/${this.userUid}`).update({
      DNI: newData.DNI,
      nombre: newData.nombre,
      telefono: newData.telefono,
      countryCode: newData.country
    })

    this.changePhone(newData.telefono, newData.country);
    this.changeEmail(newData.email);
    if(newData.password) {
      this.changePassword(newData.password);
    }
  }

  private changePassword(newPassword: string) {
    this.afAuth.auth.currentUser.updatePassword(newPassword);
  }

  private changeEmail(newEmail: string) {
    this.afAuth.auth.currentUser.updateEmail(newEmail);
  }

  private changePhone(newPhone: string, newCountry: string) {
    this.http.post('https://us-central1-fichaje-uni.cloudfunctions.net/updatePhone', {
      tel: newPhone,
      country: newCountry,
      uid: this.afAuth.auth.currentUser.uid
    }).subscribe(response => {}, err => {})
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then(val => {
        console.log("Logged out");
        this.router.navigateByUrl("auth");
      })
      .catch(err => {
        console.log("Cannot log out");
      });
  }
}
