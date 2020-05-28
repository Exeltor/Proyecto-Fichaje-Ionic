import { Injectable } from "@angular/core";
import {
  ModalController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  async presentAlertError(message, from) {
    const alert = await this.alertController.create({
      header: "Error",
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            switch (from) {
              case "modal":
                this.modalController.dismiss();
                break;
              case "registrarEmpresa":
                this.router.navigateByUrl("/auth");
                break;
              default:
                break;
            }
          },
        },
        {
          text: "Editar",
        },
      ],
    });

    await alert.present();
  }

  async presentToastSinError(title, message, from) {
    const toast = await this.toastController.create({
      header: title,
      message,
      duration: 2000,
      position: "top",
    });
    switch (from) {
      case "modal":
        this.modalController.dismiss();
        break;
      case "registrarEmpresa":
        this.router.navigateByUrl("/auth");
        break;
      case "recuperarcontrasena":
        this.router.navigateByUrl("/");
        break;
      default:
        break;
    }

    await toast.present();
  }

  async reauthenticateAlert() {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: "Vuelve a introducir tu actual contraseña",
        inputs: [
          {
            name: "password",
            type: "password",
            placeholder: "Tu actual contraseña",
          },
        ],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "OK",
            handler: (data) => {
              const userEmail = this.afAuth.auth.currentUser.email;
              const credential = firebase.auth.EmailAuthProvider.credential(
                userEmail,
                data.password
              );
              this.afAuth.auth.currentUser
                .reauthenticateWithCredential(credential)
                .then(() => resolve(true))
                .catch(() => resolve(false));
            },
          },
        ],
      });

      await alert.present();
    });
  }

  loginError(error) {
    this.alertController
      .create({
        header: "No se pudo iniciar sesion",
        message: error,
        buttons: [
          {
            text: "Aceptar",
            role: "cancel",
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
