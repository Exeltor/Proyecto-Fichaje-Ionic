import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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

  editingForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.editingForm = this.fb.group({
      email: [this.email, Validators.compose([Validators.email, Validators.required])],
      DNI: [this.DNI, Validators.required],
      telefono: [this.telefono, Validators.required],
      nombre: [this.nombre, Validators.required],
      password: ['', Validators.minLength(6)],
      confirmPassword: ['']
    }, {validators : this.passwordMatchValidator});
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch' : true};
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    console.log(this.editingForm.value);
  }

}
