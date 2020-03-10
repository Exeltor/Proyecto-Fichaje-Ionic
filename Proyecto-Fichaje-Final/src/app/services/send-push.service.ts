import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SendPushService {

  constructor(private afs: AngularFirestore) { }

  sendPush(title, body, uids:Array<string>){
    this.afs.collection('pushNotifications').add({title, body, uids});
  }   
}
