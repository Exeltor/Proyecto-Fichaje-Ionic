import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ToastController, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  downloadURL: Observable<string>;

  constructor(private alertService: AlertService, private storage: AngularFireStorage) { }

  uploadFile(dataURL, directory:string, filename:string){
    const file = this.dataURItoBlob(dataURL);
    const filePath = `${directory}/${filename}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, file).then(() => {
      this.alertService.presentToastSinError("Correcto", "Foto subida correctamente", "modal")
    });

    
    
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
 }
 
}
