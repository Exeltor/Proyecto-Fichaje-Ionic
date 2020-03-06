import { HttpClient } from "@angular/common/http";
import { Injectable, ɵCodegenComponentFactoryResolver } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { Empresa } from '../models/empresa.model';
import { User } from "../models/user.model";
import { auth } from 'firebase/app';
import { LoggingService } from '../logging/logging.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SendPushService } from '../services/send-push.service'

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Observable<User>;
  empresa: Observable<Empresa>;
  Nombre_Empresa: string;
  userUid;
  ok: Boolean = false;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private logger: LoggingService,
    private sendPush: SendPushService
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

  registerUser(datos) {
    this.ok = false;
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Creando usuario"
      })
      .then(loadingEl => {
        loadingEl.present();
        const tel = `+${datos.country}${datos.telefono}`;
        const email = datos.email;
        const password = datos.password;
        this.http
          .post("https://us-central1-fichaje-uni.cloudfunctions.net/register", {
            email,
            password,
            tel
          })
          .subscribe(
            response => {
              const jsonResponse = JSON.parse(JSON.stringify(response));
              this.setUserDoc(jsonResponse.uid, datos.nombre, datos.DNI, datos.country, datos.telefono, datos.horasTrabajo);
              console.log("usuario y documento creados");
              this.presentAlertSinError('Creado', `Se ha añadido al trabajador ${datos.nombre} a tu empresa.`);
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
              this.logger.logEvent(errorMessage, 5, 'authService registerUser')
              this.presentAlertError(errorMessage);
            }
          );
      });
  }


  registerAdmin(email: string, password: string, nameSurname, hours, dni, telefono, empresa, code) {
    this.ok = false;
    this.loadingController.create({
        keyboardClose: true,
        message: "Creando administrador"
      })
      .then(loadingEl => {
        loadingEl.present();
        const tel = `+${code}${telefono}`
        this.http
          .post("https://us-central1-fichaje-uni.cloudfunctions.net/register", {
            email,
            password,
            tel
          })
          .subscribe(
            response => {
              const jsonResponse = JSON.parse(JSON.stringify(response));
              this.setAdminDoc(jsonResponse.uid, nameSurname, dni, tel, hours, empresa, code);
              loadingEl.dismiss();
              this.presentAlertSinError('Admin Registrado',`El administrador ${nameSurname} ha sido creado`)
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
              this.presentAlertError(errorMessage);
            }
          );
      });
  }



  private setUserDoc(uid, nameSurname, dni, country, tel, hours) {
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
        countryCode: country.toString(),
        telefono: tel,
        empresa: data.empresa,
        horasDiarias: hours
      };
      this.afs.collection('users')
      .ref.where('empresa', "==", data.empresa).where('admin', '==', true)
      .get().then(docs => {
        let uids:Array<string> = [];
        docs.forEach(doc =>{
          uids.push(doc.data().uid)
        })
        this.sendPush.sendPush(`Se ha creado un trabajador en la empresa ${data.empresa}`, `El administrador ${data.nombre} ha añadido a ${nameSurname} a la empresa`, uids);
        })
      userRef.set(userDoc);
      this.logger.logEvent(`User created: ${uid}`, 3, 'authService setUserDoc')
    });
  } 

  private setAdminDoc(uid, nameSurname, dni, tel, hours, empresa, code) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    // TODO: Datos se rellenan por el administrador
    

    this.user.pipe(take(1)).subscribe(data => {
      const userDoc: User = {
        DNI: dni,
        admin: true,
        countryCode: code,
        empresa: empresa,
        horasDiarias: hours,
        nombre: nameSurname,
        telefono: tel,
        uid
      };

      userRef.set(userDoc);
    });
  }

  crearEmpresa(cif, nombre, loc1, loc2){
    this.ok = false;
    this.afs.collection(`empresas`).doc(cif).set({
      Nombre: nombre,
      id: cif,
      loc:[loc1, loc2]
    }).then(suc =>{}).catch(error => {this.ok = true;})
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
            this.logger.logEvent(`User logged in: ${val.user.uid}`, 3, 'authService login')
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
            this.logger.logEvent(`Failed to log in: ${err.code}`, 4, 'authService login')

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
          this.logger.logEvent(`Sign in with Google failed, no account linked`, 4, 'authService signInWithGoogle')
        })
      } else {
        this.logger.logEvent(`Signed in with Google: ${val.user.uid}`, 3, 'authService signInWithGoogle')
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
          this.logger.logEvent(`Sign in with Facebook failed, no account linked`, 4, 'authService signInWithFacebook')
        })
      } else {
        this.logger.logEvent(`Signed in with Facebook: ${val.user.uid}`, 3, 'authService signInWithFacebook')
        this.router.navigateByUrl("/home");
      }
    });
  }

  getSignInMethods() {
    return this.afAuth.auth.currentUser.providerData;
  }

  updateProfile(newData) {
    this.ok = false;
    // idFecha viejo -> nuevo
    try {
      this.afs.doc<User>(`users/${this.userUid}`).valueChanges().pipe(take(1)).subscribe(user => {
        this.afs.doc(`users/${this.userUid}`).update({
          DNI: newData.DNI,
          nombre: newData.nombre,
        })
        this.changePhone(newData.telefono, newData.country);
        this.changeEmail(newData.email);
        if(newData.password) {
          this.changePassword(newData.password);
        }
        this.presentAlertSinError('Perfil editado', `El perfil de ${newData.nombre} ha sido correctamente editado`)
        this.updateHistory(newData, user);
        this.logger.logEvent(`User ${user.uid} updated profile`, 3, 'authService updateProfile')
      })
    } catch (error) {
      console.log(error);
      this.logger.logEvent(`${this.userUid}: ${error}`, 4, 'authService updateProfile');
      this.presentAlertError(error);
    }
  }

  private updateHistory(newData, previousData) {
    let changes = {};
    if(newData.DNI !== previousData.DNI) {
      changes = {...changes, '-DNI': previousData.DNI, '+DNI': newData.DNI}
    }

    if(newData.nombre !== previousData.nombre) {
      changes = {...changes, '-nombre': previousData.nombre, '+nombre': newData.nombre}
    }

    if(newData.country !== previousData.countryCode) {
      changes = {...changes, '-country': previousData.countryCode, '+country': newData.country}
    }

    if(newData.telefono !== previousData.telefono) {
      changes = {...changes, '-telefono': previousData.telefono, '+telefono': newData.telefono}
    }

    if(newData.DNI !== previousData.DNI) {
      changes = {...changes, '-DNI': previousData.DNI, '+DNI': newData.DNI}
    }

    const currentDate = new Date().toString()
    this.afs.collection(`users/${this.userUid}/historicoDatos`).doc(currentDate).set(changes)
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
    }).subscribe(response => {}, err => {
      if(err.error.text === 'Done') {
        this.afs.doc(`users/${this.userUid}`).update({
          telefono: newPhone,
          countryCode: newCountry
        })
      }
    })
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then(val => {
        console.log("Logged out");
        this.router.navigateByUrl("auth");
        this.logger.logEvent(`User ${this.userUid} logged out`, 3, 'authService logout')
      })
      .catch(err => {
        this.logger.logEvent(err, 4, 'authService logout')
      });
  }
  async presentAlertError(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.modalController.dismiss();
          }
        }, {
          text: 'Editar',
        }
      ]
    });

    await alert.present();
  }

  async presentAlertSinError(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.modalController.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
