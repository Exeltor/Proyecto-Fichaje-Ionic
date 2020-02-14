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

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Observable<User>;
  empresa: Observable<any>;
  Nombre_Empresa: string;

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
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  registerUser(email: string, password: string, nameSurname, dni, tel, hours) {
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
              this.setUserDoc(jsonResponse.uid, nameSurname, dni, tel, hours);
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

  private setUserDoc(uid, nameSurname, dni, tel, hours) {
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
        telefono: tel,
        Nombre_Empresa: data.Nombre_Empresa,
        horasDiarias: hours,
      };

      userRef.set(userDoc);
    });
  }

  private crearEmpresa(nombre, id, loc){
    const empresaRef: AngularFirestoreDocument<any> = this.afs.doc(
      `empresas/${id}`
    );

    this.empresa.pipe(take(1)).subscribe(data => {
      const empresaDoc: any = {
        id,
        Nombre: nombre,
        loc: loc,
      };

      empresaRef.set(empresaDoc);
    });
}


  registerAdmin(nombreEmpresa, loc, email: string, password: string, nameSurname, dni, tel, hours) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Creando administrador"
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
              this.setAdminDoc(jsonResponse.uid, nameSurname, dni, tel, hours);
              this.crearEmpresa(nombreEmpresa, jsonResponse.id, loc);
              console.log("administrador, empresa y documento creados");
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



  private setAdminDoc(uid, nameSurname, dni, tel, hours) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    // TODO: Datos se rellenan por el administrador
    this.user.pipe(take(1)).subscribe(data => {
      const userDoc: User = {
        uid,
        nombre: nameSurname,
        DNI: dni,
        admin: true,
        telefono: tel,
        Nombre_Empresa: data.Nombre_Empresa,
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
