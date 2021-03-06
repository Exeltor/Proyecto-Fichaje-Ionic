import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FichajeService {
  currentTimestamp: Date = new Date();
  currentWorkingData: Observable<any>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {
    // Asignacion de la variable como observable para poder monitorizar el estado de la coleccion respectiva a medida que se vayan modificando los datos
    // Permite mostrar los ultimos datos de la BD en tiempo real en la aplicacion
    this.currentWorkingData = this.authService.user.pipe(switchMap(userdata => {
      if (userdata){
        return this.afs.doc(`users/${
          userdata.uid
        }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  // Creacion del documento del respectivo dia de trabajo y marcado de la hora en la que se comenzo el dia de trabajo
  startWorkDay() {
    // Comprobamos si el documento existe
    
    this.authService.user.pipe(take(1)).subscribe(async userData => {
      const horario = await this.afs.doc<any>(`empresas/${userData.empresa}/horarios/${userData.horario}`).valueChanges().pipe(take(1)).toPromise();
      const numPausas = horario.pausas.num;
      this.afs.firestore
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (!docSnapshot.exists) {
            // Inicializacion del documento con la hora actual
            const entryRef: AngularFirestoreDocument<any> = this.afs.doc(
              `users/${
                userData.uid
              }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
            );
            const data = {
              horaInicio: new Date(),
              horasPausa: [],
              horasResume: [],
              pausasRestantes: numPausas
            };
            entryRef.set(data);
          }
        });
    });
  }

  // Añadido de la timestamp acual en el array de pausas para fijar el tiempo en el que se inicio el descanso
  pauseWorkDay() {
    // Comprobamos si el documento existe
    this.authService.user.pipe(take(1)).subscribe(userData => {
      this.afs
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
        )
        .ref.update({
          horasPausa: firebase.firestore.FieldValue.arrayUnion(new Date()),
          pausasRestantes: firebase.firestore.FieldValue.increment(-1)
        });
    });
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Vuelve al trabajo",
          body: "Llevas 15 minutos descansando, vuelve al trabajo",
          id: 1,
          schedule: { at: new Date(Date.now() + 900000) }
        }
      ]
    });
  }

  // Añadido de la timestamp acual en el array de resumir para fijar el tiempo en el que se termino el descanso
  resumeWorkDay() {
    // Comprobamos si el documento existe
    this.authService.user.pipe(take(1)).subscribe(userData => {
      this.afs
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
        )
        .ref.update(
          'horasResume',
          firebase.firestore.FieldValue.arrayUnion(new Date())
        );
    });
  }

  // Creacion del campo 'horaFin' que contiene la timestamp en la que el dia de trabajo ha sido finalizado
  endWorkDay() {
    this.authService.user.pipe(take(1)).subscribe(userData => {
    const entryRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${
        userData.uid
      }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()+1}-${this.currentTimestamp.getFullYear()}`
    );
    const data = {
      horaFin: new Date()
    };
    entryRef.update(data);
    });
  }
  
  getServerDate() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}
