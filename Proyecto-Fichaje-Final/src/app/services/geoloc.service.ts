import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { AuthService } from "../auth/auth.service";
import { take } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class GeolocService {
  constructor(
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private authService: AuthService,
    private afs: AngularFirestore,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {}

  getLoc() {
    return this.geolocation
      .getCurrentPosition()
      .then(data => {
        return [data.coords.latitude, data.coords.longitude];
      })
      .catch(error => {
        throw new Error("Can't get location");
      });
  }

  async activateLocation() {
    return await new Promise<boolean>(async resolve => {
      if (this.platform.is("cordova")) {
        const permission = await this.isLocationEnabled();
        console.log(permission);

        if (!permission) {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy
                .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                .then(
                  () => {
                    console.log("Request successful");
                    resolve(true);
                  },
                  error => {
                    console.log("Error requesting location permissions", error);
                    resolve(false);
                  }
                );
            }
          });
        } else {
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  async isLocationEnabled() {
    return this.diagnostic.isLocationAuthorized();
  }

  getEmpresaCoordinates() {
    return this.authService.user
      .pipe(take(1))
      .toPromise()
      .then(user => {
        return this.afs
          .doc(`empresas/` + user.empresa)
          .get()
          .toPromise()
          .then(data => {
            return data.get("loc");
          });
      });
  }

  liveLocationObservable() {
    return this.geolocation.watchPosition();
  }
}
