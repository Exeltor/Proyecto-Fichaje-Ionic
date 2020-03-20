import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-horario-modal',
  templateUrl: './add-horario-modal.component.html',
  styleUrls: ['./add-horario-modal.component.scss'],
})
export class AddHorarioModalComponent implements OnInit {
  horaEntrada;
  horaSalida;
  numPausas;
  timePausa;
  horarioForm: FormGroup;
  constructor(private modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.horarioForm = this.fb.group({
      horaEntrada: ['08:00', Validators.required],
      horaSalida: ['17:00', Validators.required],
      numPausas: ['', Validators.required],
      timePausa: ['', Validators.required]
    });
  }
  log(){
    console.log(this.horaEntrada_, "horaEntrada")
    console.log(this.horaSalida_, "horaSalida")
  }
  modalDismiss(){
    this.modalController.dismiss();
  }
  get horaEntrada_(){
    return this.horarioForm.get('horaEntrada');
  }
  get horaSalida_(){
    return this.horarioForm.get('horaSalida');
  }
}
