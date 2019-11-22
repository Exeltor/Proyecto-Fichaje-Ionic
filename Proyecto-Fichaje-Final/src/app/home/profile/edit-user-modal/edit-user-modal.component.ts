import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {
  @Input() nombre: string;
  @Input() DNI: string;
  @Input() telefono: string;
  @Input() email: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit(form: NgForm) {
    
  }

}
