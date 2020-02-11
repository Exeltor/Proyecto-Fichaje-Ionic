import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-uinfo',
  templateUrl: './uinfo.page.html',
  styleUrls: ['./uinfo.page.scss'],
})
export class UinfoPage implements OnInit {
  @Input () nombreU: string;
  @Input () telf: string;
  @Input () DNI: string;
  @Input () horasD: string;
  empresa: Observable<any>;
  constructor(public mdlCtrl: ModalController, public navParams: NavParams,
              public authService: AuthService, public afs: AngularFirestore) { }

  public closeModal() {
    this.mdlCtrl.dismiss();
  }

  ngOnInit() {
    this.empresa = this.authService.user.pipe(switchMap(user=>{
      return this.afs.doc(
        `empresas/` + user.empresa
      ).valueChanges();
    }))
  }

}
