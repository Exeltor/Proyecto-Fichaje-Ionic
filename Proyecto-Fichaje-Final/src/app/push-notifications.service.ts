import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private firebaseNative: FirebaseX, private afMessaging: AngularFireMessaging, private platform: Platform, private afs: AngularFirestore, private authService: AuthService) { }

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }
    
    if(this.platform.is('ios')) {
      if(!this.firebaseNative.hasPermission) await this.firebaseNative.grantPermission();
      
      token = await this.firebaseNative.getToken().catch(err => {
        console.log('ios token error', err);
      });
    }

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
    }

    return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token,
      userId: this.authService.userUid
    }

    return devicesRef.doc(token).set(docData)
  }
}
