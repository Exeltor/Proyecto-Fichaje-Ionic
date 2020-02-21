import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

// Importar a todas las clases donde se necesite hacer logging
export class LoggingService {

  constructor(private afs: AngularFirestore) { }

  /**
   * 
   * @param message 
   * @param level 
   * Niveles
   * 0 - Warn
   * 1 - Debug
   * 2 - Info
   * 3 - Warn
   * 4 - Error
   * 5 - Fatal
   * @param origin 
   */
  logEvent(message: string, level: number, origin: string) {
    const currentTime = new Date();
    this.afs.collection('logs').add({message, level, origin, time: currentTime});
  }

  getEventsByLevel(level: number) {
    this.afs.collection('logs', ref => ref.where('level', '==', level).orderBy('time', 'desc'))
  }


}
