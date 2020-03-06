import { Component, OnInit, Input } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { countryCodes } from "src/environments/environment";
import { PhoneValidator } from "src/app/auth/phone.validator";

@Component({
  selector: "app-register-user-modal",
  templateUrl: "./register-user-modal.component.html",
  styleUrls: ["./register-user-modal.component.scss"]
})
export class RegisterUserModalComponent implements OnInit {
  @Input() nombre: string;
  @Input() DNI: string;
  @Input() telefono: string;
  @Input() email: string;
  @Input() country: string;
  @Input() password: string;
  @Input() horasTrabajo: number;
  admin = true;
  paises = countryCodes;
  registerForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private fb: FormBuilder,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ["", Validators.compose([Validators.email, Validators.required])],
      DNI: ["", Validators.required],
      country: [this.country, Validators.required],
      telefono: [
        "",
        Validators.compose([PhoneValidator.number_check(), Validators.required])
      ],
      nombre: ["", Validators.required],
      password: ["", Validators.compose([Validators.required,Validators.minLength(6)])],
      horasTrabajo: ["", Validators.max(24)]
    });
  }

  updateAll(){
    PhoneValidator.country_check(this.registerForm.value.country);
  };

  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    this.authService.registerUser(this.registerForm.value);
  }

  

}
