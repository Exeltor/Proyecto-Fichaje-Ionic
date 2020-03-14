import { Injectable } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private modalController: ModalController, private alertController: AlertController) { }

  async presentAlertError(message, func) {
    const alert = await this.alertController.create({
      header: "Error",
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: func
        },
        {
          text: "Editar"
        }
      ]
    });

    await alert.present();
  }

  async presentAlertSinError(title, message, func: () => void ) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: func
        }
      ]
    });

    await alert.present();
  }
}


