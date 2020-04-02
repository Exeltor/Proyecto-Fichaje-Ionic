import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
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
    return await new Promise<{ enabled: boolean, denied: boolean, deniedAlways: boolean }>(async resolve => {
      if (this.platform.is("cordova")) {
        const permissions = await this.isLocationEnabled();
        console.log(permissions, 'before location request');

        if (!permissions.enabled && !permissions.deniedAlways) {
          this.diagnostic
            .requestLocationAuthorization()
            .then(async response => {
              console.log("success requesting", response);
              const locationStatus = await this.isLocationEnabled();
              resolve(locationStatus);
            })
            .catch(error => {
              console.log("Error requesting", error), resolve({ enabled: false, denied: true, deniedAlways: false });
            });
        } else if (permissions.deniedAlways) {
          resolve({ enabled: false, denied: true, deniedAlways: true });
        } else if (permissions.enabled) {
          resolve({ enabled: true, denied: false, deniedAlways: false })
        }
      } else {
        resolve({ enabled: true, denied: false, deniedAlways: false });
      }
    });
  }

  async isLocationEnabled(): Promise<{ enabled: boolean, denied: boolean, deniedAlways: boolean }> {
    return this.diagnostic.getLocationAuthorizationStatus().then(status => {
      switch (status) {
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
          return { enabled: false, denied: false, deniedAlways: false }
        case this.diagnostic.permissionStatus.GRANTED:
          return { enabled: true, denied: false, deniedAlways: false };
        case this.diagnostic.permissionStatus.DENIED_ONCE:
          return { enabled: false, denied: true, deniedAlways: false };
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
          return { enabled: false, denied: true, deniedAlways: true }
        case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          return { enabled: true, denied: false, deniedAlways: false }
      }
    });
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
