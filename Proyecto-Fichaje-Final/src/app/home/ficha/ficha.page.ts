import { Component, OnInit } from '@angular/core';
import { FichajeService } from './fichaje.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.page.html',
  styleUrls: ['./ficha.page.scss'],
})
export class FichaPage implements OnInit {
  comenzado = false;
  enPausa = false;

  constructor(private toastController: ToastController, private alertController: AlertController, private fichajeService: FichajeService) { }

  ngOnInit() {
  }

  flipPausa() {
    this.enPausa = !this.enPausa;
    if (this.enPausa) {
      this.toastPausaResume('Acabas de pausar');
      this.fichajeService.pauseWorkDay();
    } else {
      this.toastPausaResume('Acabas de resumir');
      this.fichajeService.resumeWorkDay();
    }
  }

  toastPausaResume(message: string) {
    this.toastController.create({
      color: 'dark',
      message,
      duration: 2000,
      position: 'top'
    }).then(toastEl => {
      toastEl.present();
    });
  }

  comenzarDia() {
    if(!this.comenzado) {
      this.comenzado = !this.comenzado;
      this.fichajeService.startWorkDay();
    }
  }

  finalizarDia() {
    if (this.comenzado) {
      this.alertController.create({
        header: 'Confirmacion',
        message: '¿Estas seguro que quieres finalizar el dia?',
        buttons: [
          {
            text: 'Si',
            handler: () => {
              console.log('Dia finalizado');
              this.comenzado = !this.comenzado;
              this.fichajeService.endWorkDay();
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('cancelado');
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
  }
}