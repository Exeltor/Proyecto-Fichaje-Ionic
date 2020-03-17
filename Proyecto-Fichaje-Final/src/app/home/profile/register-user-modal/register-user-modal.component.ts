import { Component, OnInit, Input } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { countryCodes } from "src/environments/environment";
import { PhoneValidator } from "src/app/auth/phone.validator";
import { MapaModalComponent } from "../../../shared/mapaModal/mapaModal.component"
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-register-user-modal",
  templateUrl: "./register-user-modal.component.html",
  styleUrls: ["./register-user-modal.component.scss"]
})
export class RegisterUserModalComponent implements OnInit {
  latPersona;
  lonPersona;

  nombre: string;
  DNI: string;
  telefono: string;
  email: string;
  country: string;
  password: string;
  horasTrabajo: number;
  direccionPersona: string;
  admin = true;
  paises = countryCodes;
  registerForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private fb: FormBuilder,
    public alertController: AlertController,
    private http: HttpClient
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
      direccionPersona: ["", Validators.required],
      latPersona: ["", Validators.required],
      lonPersona: ["", Validators.required],
      nombre: ["", Validators.required],
      password: ["", Validators.compose([Validators.required,Validators.minLength(6)])],
      horasTrabajo: ["", Validators.max(24)]
    });
  }

  get personaCoords_() {
    return this.registerForm.get('latPersona')
  }

  get direccion_() {
    return this.registerForm.get('direccionPersona');
  }

  get countryCode_(){
    return this.registerForm.get('country');
  }
  async openMap() {
    let direccionEncoded = encodeURI(this.registerForm.value.direccion);

    let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/${direccionEncoded}?format=json`).toPromise()

    const latLon = [jsonQ[0].lat, jsonQ[0].lon]

    let modal = await this.modalController.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Marca la localizacion' }
    })

    modal.onDidDismiss().then((callback) => {
      if (callback.data === undefined) return;
      this.latPersona = callback.data.lat;
      this.lonPersona = callback.data.lng;
    })

    await modal.present();
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
