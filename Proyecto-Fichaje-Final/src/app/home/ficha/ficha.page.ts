import { Component, OnInit } from "@angular/core";
import { FichajeService } from "./fichaje.service";
import { ToastController, AlertController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-ficha",
  templateUrl: "./ficha.page.html",
  styleUrls: ["./ficha.page.scss"]
})
export class FichaPage implements OnInit {
  currentTimestamp: Date = new Date();
  comenzado;
  enPausa;
  masPauses;
  terminado;
  isLoading;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    public fichajeService: FichajeService,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.getIfComenzado();
  }
  calcTimeDiff(horaInicio: Date, horaFin: Date) {
    const diff = new Date(horaFin.getTime() - horaInicio.getTime());

    console.log(diff.getHours(), diff.getMinutes(), diff.getSeconds());
  }

  /*
    Flipper del estado de pausa (descanso)
    Realiza llamada a fichajeService para comunicacion con backend
  */
  flipPausa() {
    this.enPausa = !this.enPausa;
    this.masPauses = !this.masPauses;
    if (this.enPausa) {
      this.toastPausaResume("Acabas de pausar");
      this.fichajeService.pauseWorkDay();
    } else {
      this.toastPausaResume("Acabas de resumir");
      this.fichajeService.resumeWorkDay();
    }
  }

  // Toast informativo sobre el correcto cambio de estado del descanso y continuacion de trabajo
  toastPausaResume(message: string) {
    this.toastController
      .create({
        color: "dark",
        message,
        duration: 2000,
        position: "top"
      })
      .then(toastEl => {
        toastEl.present();
      });
  }

  /*
    Flipper del comienzo de dia. Se realiza doble comprobacion si la interfaz no esta mostrada correctamente
    Realiza llamada a fichajeService para comunicacion con backend
  */
  comenzarDia() {
    if (!this.comenzado) {
      this.comenzado = !this.comenzado;
      this.fichajeService.startWorkDay();
    }
  }

  /*
    Alerta de confirmacion de finalizacion del dia de trabajo, en el caso de que la persona haya presionado el boton erroneamente
  */
  finalizarDia() {
    if (this.comenzado) {
      this.alertController
        .create({
          header: "Confirmacion",
          message: "¿Estas seguro que quieres finalizar el dia?",
          buttons: [
            {
              text: "Si",
              handler: () => {
                console.log("Dia finalizado");
                this.comenzado = !this.comenzado;
                this.terminado = true;
                this.fichajeService.endWorkDay();
              }
            },
            {
              text: "No",
              role: "cancel",
              handler: () => {
                console.log("cancelado");
              }
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
    }
  }
  reabrirDia() {
    console.log("Hola Mundo");
    console.log(this.comenzado);
    if (this.comenzado) {
      this.alertController
        .create({
          header: "Confirmacion",
          message: "¿Estas seguro que quieres reabrir el dia?",
          buttons: [
            {
              text: "Si",
              handler: () => {
                console.log("Dia reabierto");
                this.comenzado = !this.comenzado;
                this.terminado = false;
                // this.fichajeService.endWorkDay();
                this.fichajeService.editWorkDay();
              }
            },
            {
              text: "No",
              role: "cancel",
              handler: () => {
                console.log("cancelado");
              }
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
    }
  }

  /*
    Funcion de comunicacion implementada aqui de forma temporal (para su posterior exportacion a fichajeService)
    Comprueba si el dia de trabajo ya ha sido comenzado para mostrar la interfaz de forma correcta en un reinicio de la aplicacion
  */
  getIfComenzado() {
    this.isLoading = true;
    // Cogemos el uid del usuario de la sesion
    this.authService.user.pipe(take(1)).subscribe(userdata => {
      this.afs.firestore
        .doc(
          `users/${
            userdata.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (!docSnapshot.exists) {
            this.comenzado = false;
            this.isLoading = false;
          } else {
            this.comenzado = true;
            this.getMenosPauses();
            this.getIfTerminado();
          }
        });
    });
  }

  /*
    Funcion de comunicacion implementada aqui de forma temporal (para su posterior exportacion a fichajeService)
    Comprueba si el dia de trabajo ya ha sido terminado para mostrar la interfaz de forma correcta en un reinicio de la aplicacion
  */
  getIfTerminado() {
    // Cogemos el uid del usuario de la sesion
    this.authService.user.pipe(take(1)).subscribe(userdata => {
      this.afs.firestore
        .doc(
          `users/${
            userdata.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (!docSnapshot.get("horaFin")) {
            this.terminado = false;
          } else {
            this.terminado = true;
          }

          this.isLoading = false;
        });
    });
  }

  /*
    Funcion de comunicacion implementada aqui de forma temporal (para su posterior exportacion a fichajeService)
    Calcula las horas de pausa y resumir para mostrar los botones de descanso y resumir de forma correcta en la interfaz
  */
  getMenosPauses() {
    // Cogemos el uid del usuario de la sesion
    this.authService.user.pipe(take(1)).subscribe(userdata => {
      this.afs.firestore
        .doc(
          `users/${
            userdata.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (
            docSnapshot.get("horasResume").length <
            docSnapshot.get("horasPausa").length
          ) {
            this.masPauses = true;
            this.enPausa = true;
          } else {
            this.masPauses = false;
          }
        });
    });
  }
}
