import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {

  constructor(private geolocation: Geolocation) { }


  getLoc(){
    return this.geolocation.getCurrentPosition().then((data)=> {
      return [data.coords.latitude, data.coords.longitude];
    }).catch((error)=>{
      console.log('Oyeme mami hay un error', error);
    })
  }
}
