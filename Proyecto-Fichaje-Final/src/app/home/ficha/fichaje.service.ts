import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class FichajeService {
  currentTimestamp: Date = new Date();

  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  
  startWorkDay() {
    // Comprobamos si el documento existe
    this.afs.firestore.doc(`horasTrabajo/${this.authService.useruid}/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`).get().then(docSnapshot => {
      if (!docSnapshot.exists) {
        // Inicializacion del documento con la hora actual
        const entryRef: AngularFirestoreDocument<any> = this.afs.doc(
          `horasTrabajo/${this.currentTimestamp.getDate()}-${this.currentTimestamp.getMonth()}-${this.currentTimestamp.getFullYear()}`
        );
    
        const startTime = {
          timeStamp : new Date()
        }
    
        entryRef.set(startTime);
      }
    });
  }
}
