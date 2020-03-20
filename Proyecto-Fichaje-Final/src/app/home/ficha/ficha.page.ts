import { Component, OnInit, OnDestroy } from "@angular/core";
import { FichajeService } from "../../services/fichaje.service";
import { ToastController, AlertController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { take } from "rxjs/operators";
import { GeolocService } from '../../services/geoloc.service';
import { Platform } from '@ionic/angular';
import * as geolib from 'geolib';
import { Subscription, Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: "app-ficha",
  templateUrl: "./ficha.page.html",
  styleUrls: ["./ficha.page.scss"]
})
export class FichaPage implements OnInit, OnDestroy {
  currentTimestamp: Date = new Date();
  comenzado;
  enPausa;
  masPauses;
  terminado;
  isLoading;
  dayDocument: Observable<any>
  locationEnabled = false;
  liveLocation: Subscription;
  isInRange = false;
  coordsEmpresa;
  locationAccuracy = 5;
  timer;
  timeWorked;
  locationStatus: { enabled: boolean, denied: boolean, deniedAlways: boolean } = { enabled: false, denied: true, deniedAlways: false };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    public fichajeService: FichajeService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private geoService: GeolocService,
    public platform: Platform
  ) {}

  async ngOnInit() {
    this.checkAndEnableLocation();
    this.getDayDocument();
  }

  getDayDocument() {
    this.dayDocument = this.afs.doc(`users/${this.authService.afAuth.auth.currentUser.uid}/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`).valueChanges();
  }

  ionViewDidEnter() {
    this.enableLiveLocation();
    this.getIfComenzado();
  }

  ionViewDidLeave() {
    if(this.liveLocation) {
      this.liveLocation.unsubscribe();
      console.log('unsubscribed location')
    }
    if(this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy() {
    if(this.liveLocation) {
      this.liveLocation.unsubscribe();
      console.log('unsubscribed location')
    }
  }

  calcTimeDiff(horaInicio: Date, horaFin: Date) {
    const diff = new Date(horaFin.getTime() - horaInicio.getTime());

    console.log(diff.getHours(), diff.getMinutes(), diff.getSeconds());
  }

  /*
    Flipper del estado de pausa (descanso)
    Realiza llamada a fichajeService para comunicacion con backend
  */
  async flipPausa() {
    const currentDoc = await this.dayDocument.pipe(take(1)).toPromise();
    this.enPausa = !this.enPausa;
    this.masPauses = !this.masPauses;
    if (this.enPausa) {
      if(currentDoc.pausasRestantes > 0) {
        this.toastPausaResume("Acabas de pausar");
        this.fichajeService.pauseWorkDay();
      } else {
        this.toastPausaResume("No te quedan pausas");
        this.enPausa = !this.enPausa;
        this.masPauses = !this.masPauses;
      }
    } else {
      this.toastPausaResume("Acabas de resumir");
      this.fichajeService.resumeWorkDay();
    }

    //this.setTimer();
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

  async checkAndEnableLocation() {
    this.locationStatus = await this.geoService.activateLocation();
    console.log('locationEnabled after CheckAndEnableLocation', this.locationStatus.enabled)
  }

  enableLiveLocation() {
    this.liveLocation = this.geoService.liveLocationObservable().subscribe(async location => {
      const currentPosition = location.coords;
      this.locationAccuracy = currentPosition.accuracy;
      console.log(currentPosition)
      await this.getCoordsEmpresa();
      if (geolib.isPointWithinRadius({latitude: currentPosition.latitude, longitude: currentPosition.longitude}, {latitude: this.coordsEmpresa[0], longitude: this.coordsEmpresa[1]}, 100)) {
        this.isInRange = true;
      } else {
        this.isInRange = false;
      }

      console.log('in range', this.isInRange);
    });
  }

  async getCoordsEmpresa() {
    this.coordsEmpresa = await this.geoService.getEmpresaCoordinates();
  }
  /*
    Flipper del comienzo de dia. Se realiza doble comprobacion si la interfaz no esta mostrada correctamente
    Realiza llamada a fichajeService para comunicacion con backend
  */
  comenzarDia() {
    if(this.platform.is('cordova')) {
      if(!this.locationStatus.enabled) return;
    }
    this.isLoading = false;

    if (this.isInRange && !this.comenzado) {
      this.comenzado = !this.comenzado;
      this.fichajeService.startWorkDay();
    } else {
      this.toastPausaResume("Tienes que estar en el trabajo para empezar tu jornada laboral");
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
                //this.setTimer();
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
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(async docSnapshot => {
          if (!docSnapshot.exists) {
            this.comenzado = false;
            this.isLoading = false;
          } else {
            this.comenzado = true;
            await this.getMenosPauses();
            await this.getIfTerminado();
          }
        });
    });
  }

  private async setTimer() {
    const startedDoc = await this.dayDocument.pipe(take(1)).toPromise();
    const startedTime = startedDoc.horaInicio.toDate();
    const horaTotal = startedDoc.horaTotal.toDate().getTime();
    const momentTotal = moment(horaTotal)

    if(this.terminado) {
      this.timeWorked = horaTotal;
      return
    }

    if(this.comenzado) {
      if(this.masPauses) {
        if(this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        const horaTotalMoment = moment(horaTotal).subtract(1, 'hours');
        this.timeWorked = horaTotalMoment.toDate()
      } else if (horaTotal > 0 && !this.masPauses) {
         // Aqui literalmente muere, ayuda
          const currentTimestamp = new Date();
          const currentMoment = moment(currentTimestamp);
          const startedMoment = moment(startedTime)
          console.log('stated time', startedMoment)
          const totalDiff = moment.duration(currentMoment.diff(startedMoment, 'minutes'));
          console.log('total Diff', totalDiff)
          const restingTime = totalDiff.subtract(momentTotal.hours(), 'hours').subtract(momentTotal.minutes(), 'minutes').subtract(momentTotal.seconds(), 'seconds')
          console.log('resting time', restingTime)
        //   const restingTime = moment.duration(momentTotal.diff(totalDiff))
        //   console.log(restingTime);
        // this.timer = setInterval(() => {
        //   const totalWorked = totalDiff.subtract(restingTime.hours(), 'hours').subtract(restingTime.minutes(), 'minutes').subtract(restingTime.seconds(), 'seconds');
        //   this.timeWorked = totalWorked.toDate();
        //   console.log('time worked', this.timeWorked)
        // }, 1000)
      } else {
        this.timer = setInterval(() => {
          this.timeWorked = moment(new Date().getTime() - startedTime).subtract(1, 'hours').toDate();
        }, 1000)
      }
    }
  }

  /*
    Funcion de comunicacion implementada aqui de forma temporal (para su posterior exportacion a fichajeService)
    Comprueba si el dia de trabajo ya ha sido terminado para mostrar la interfaz de forma correcta en un reinicio de la aplicacion
  */
  getIfTerminado() {
    // Cogemos el uid del usuario de la sesion
    return this.authService.user.pipe(take(1)).subscribe(userdata => {
      this.afs.firestore
        .doc(
          `users/${
            userdata.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (!docSnapshot.get("horaFin")) {
            this.terminado = false;
          } else {
            this.terminado = true;
          }
          console.log('getIfTerminado')
          //this.setTimer();
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
    return this.authService.user.pipe(take(1)).subscribe(userdata => {
      this.afs.firestore
        .doc(
          `users/${
            userdata.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
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
          console.log('getMenosPauses')
        });
    });
  }
}
