import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { switchMap, take } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-add-horario-modal",
  templateUrl: "./add-horario-modal.component.html",
  styleUrls: ["./add-horario-modal.component.scss"]
})
export class AddHorarioModalComponent implements OnInit {
  @Input() empresa;
  horaEntrada;
  horaSalida;
  numPausas;
  timePausa;
  horarioForm: FormGroup;
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.horarioForm = this.fb.group({
      horaEntrada: ["08:00", Validators.required],
      horaSalida: ["17:00", Validators.required],
      numPausas: ["", Validators.required],
      timePausa: ["", Validators.required]
    });
  }
  modalDismiss() {
    this.modalController.dismiss();
  }
  get horaEntrada_() {
    return this.horarioForm.get("horaEntrada");
  }
  get horaSalida_() {
    return this.horarioForm.get("horaSalida");
  }
  create() {
    this.authService.createHorario(this.horarioForm.value);
    this.modalDismiss();
  }
}
