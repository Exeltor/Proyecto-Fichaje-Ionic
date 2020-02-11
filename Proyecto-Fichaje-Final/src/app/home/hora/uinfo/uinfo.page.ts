import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

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

  constructor(public mdlCtrl: ModalController, public navParams: NavParams) { }

  public closeModal() {
    this.mdlCtrl.dismiss();
  }

  ngOnInit() {
  }

}
