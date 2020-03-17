import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {

  constructor(private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private authService: AuthService, private afs: AngularFirestore, private diagnostic: Diagnostic) { }


  getLoc(){
    return this.geolocation.getCurrentPosition().then((data)=> {
      return [data.coords.latitude, data.coords.longitude];
    }).catch((error)=>{
      throw new Error("Can't get location");
    })
  }

  activateLocation(){
    const permission = this.isLocationEnabled();

    if(!permission) {
      return this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
          // the accuracy option will be ignored by iOS
          return this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              console.log('Request successful')
              return false;
            } ,
            error => {
              console.log('Error requesting location permissions', error)
              return true;
            }
          );
        }
      });
    }
  }

  async isLocationEnabled() {
    return await this.diagnostic.isLocationEnabled();
  }

  getEmpresaCoordinates(){
    return this.authService.user.pipe(take(1)).toPromise().then(user => {
      return this.afs.doc(`empresas/` + user.empresa).get().toPromise().then(data => {
        return data.get("loc");
      })
    })
  }
}
