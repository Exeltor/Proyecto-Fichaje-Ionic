import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  

  // Observable con la coleccion de usuarios de la base de datos
  fireList: Observable<any> = this.afs.collection(
    `users`
  ).valueChanges();

  constructor(public authService: AuthService, public afs: AngularFirestore) { }
  


  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
     // if (this.fireList.length == 1000) {
       // event.target.disabled = true;
      //}
    }, 500);
  }

  

  ngOnInit() {
  }
}
