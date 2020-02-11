import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-uinfo',
  templateUrl: './uinfo.page.html',
  styleUrls: ['./uinfo.page.scss'],
})
export class UinfoPage implements OnInit {

  constructor(public mdlCtrl: ModalController) { }

  public closeModal() {
    this.mdlCtrl.dismiss();
  }

  ngOnInit() {
  }

}
