import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';

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
    this.currentWorkingData = this.authService.user.pipe(switchMap(userdata => {
      if (userdata){
        return this.afs.doc(`users/${
          userdata.uid
        }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  startWorkDay() {
    // Comprobamos si el documento existe
    this.authService.user.pipe(take(1)).subscribe(userData => {
      this.afs.firestore
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .get()
        .then(docSnapshot => {
          if (!docSnapshot.exists) {
            // Inicializacion del documento con la hora actual
            const entryRef: AngularFirestoreDocument<any> = this.afs.doc(
              `users/${
                userData.uid
              }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
            );
            const data = {
              horaInicio: new Date(),
              horasPausa: [],
              horasResume: [],
            };
            entryRef.set(data);
          }
        });
    });
  }

  pauseWorkDay() {
    // Comprobamos si el documento existe
    this.authService.user.pipe(take(1)).subscribe(userData => {
      this.afs
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .ref.update(
          'horasPausa',
          firebase.firestore.FieldValue.arrayUnion(new Date())
        );
    });
  }

  resumeWorkDay() {
    // Comprobamos si el documento existe
    this.authService.user.pipe(take(1)).subscribe(userData => {
      this.afs
        .doc(
          `users/${
            userData.uid
          }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        )
        .ref.update(
          'horasResume',
          firebase.firestore.FieldValue.arrayUnion(new Date())
        );
    });
  }

  endWorkDay() {
    this.authService.user.pipe(take(1)).subscribe(userData => {
    const entryRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${
        userData.uid
      }/asistenciaTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
    );
    const data = {
      horaFin: new Date()
    };
    entryRef.update(data);
    });
  }
}
