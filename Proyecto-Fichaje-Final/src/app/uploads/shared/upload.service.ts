import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  uploadFile(event, directory:string, filename:string){
    const file = event.target.files[0];
    const filePath = `${directory}/${filename}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();
  }
}
