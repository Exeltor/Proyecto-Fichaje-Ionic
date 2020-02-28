import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private afMessaging: AngularFireMessaging, private platform: Platform, private afs: AngularFirestore, private authService: AuthService) { }

  async getToken() {
    if(!this.platform.is('cordova')) {
      console.log('getting token web')
      this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token); 
          this.saveTokenToFirestore(token)
          
        },
        (error) => { console.error(error); },  
      );
    } else {
      PushNotifications.register();
      PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        this.saveTokenToFirestore(token.value)
      }
    );

    PushNotifications.addListener('registrationError', 
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
    }
  }

  private saveTokenToFirestore(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token,
      userId: this.authService.afAuth.auth.currentUser.uid
    }

    return devicesRef.doc(token).set(docData)
  }
}
