import { Component, OnInit, ViewChild, Input, AfterViewInit, AfterViewChecked } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IonSlides, ModalController, NavController } from "@ionic/angular";
import { PhoneValidator } from "../phone.validator";
import { CIFValidator } from "../cif.validator";
import { countryCodes } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { MapaModalComponent } from '../../shared/mapaModal/mapaModal.component';
import { HttpClient } from '@angular/common/http';
import { DNIValidator } from '../dni.validator';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: "app-registerempresa",
  templateUrl: "./registerempresa.page.html",
  styleUrls: ["./registerempresa.page.scss"]
})
export class RegisterempresaPage implements OnInit {
  cif: String;
  nombreEmpresa: String;
  latEmpresa: String;
  lonEmpresa: String;
  direccionEmpresa: String;
  latPersona;
  lonPersona;

  nombre: string;
  DNI: string;
  telefono: string;
  email: string;
  country: string;
  password: string;
  horasTrabajo: number;

  activeIndex = 0;
  registerCompany: FormGroup;
  registerAdmin: FormGroup;
  paises = countryCodes;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.registerCompany = this.fb.group({
      cif: [
        "",
        Validators.compose([Validators.minLength(8), Validators.required]),
        CIFValidator.cif_check(this.afs)
      ],
      nombreEmpresa: ["", Validators.required],
      latEmpresa: [null, Validators.required],
      lonEmpresa: [null, Validators.required],
      direccionEmpresa: ["", Validators.required]
    });

    this.registerAdmin = this.fb.group({
      email: ["", Validators.compose([Validators.email, Validators.required])],
      DNI: ["", Validators.required, DNIValidator.dni_check(this.afs)],
      country: [this.country, Validators.required],
      telefono: [
        "",
        Validators.compose([PhoneValidator.number_check(), Validators.required])
      ],
      latPersona: ["", Validators.required],
      lonPersona: ["", Validators.required],
      direccionPersona: ["", Validators.required],
      nombre: ["", Validators.required],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      horasTrabajo: ["", Validators.max(24)]
    });
  }

  stepForward(stepper: MatStepper) {
    stepper.next();
  }

  stepBackward(stepper: MatStepper) {
    stepper.previous();
  }

  get personaCoords_() {
    return this.registerAdmin.get('latPersona')
  }

  get direccionPersona_() {
    return this.registerAdmin.get('direccionPersona');
  }

  get countryCode_(){
    return this.registerAdmin.get('country');
  }

  updateAll() {
    PhoneValidator.country_check(this.registerAdmin.value.country);
  }

  async openMap() {
    let direccionEncoded = encodeURI(this.registerCompany.value.direccionEmpresa);

    let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/${direccionEncoded}?format=json`).toPromise()

    const latLon = [jsonQ[0].lat, jsonQ[0].lon]

    let modal = await this.modalCtrl.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Encuentra tu empresa' }
    })

    modal.onDidDismiss().then((callback) => {
      console.log(callback)
      if (callback.data === undefined) return;
      this.latEmpresa = callback.data.lat;
      this.lonEmpresa = callback.data.lng;
    })

    await modal.present();

  }

  async openMapRegister() {
    let direccionEncoded = encodeURI(this.registerAdmin.value.direccionPersona);

    let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/${direccionEncoded}?format=json`).toPromise()

    const latLon = [jsonQ[0].lat, jsonQ[0].lon]

    let modal = await this.modalCtrl.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Marca la localizacion' }
    })

    modal.onDidDismiss().then((callback) => {
      console.log(callback)
      if (callback.data === undefined) return;
      this.latPersona = callback.data.lat;
      this.lonPersona = callback.data.lng;
    })

    await modal.present();

  }

  get cif_() {
    return this.registerCompany.get("cif");
  }

  get direccionEmpresa_(){
    return this.registerCompany.get("direccionEmpresa");
  }

  get dni_(){
    return this.registerAdmin.get("DNI");
  }

  cif_check(data){
    //this.blockSwipeif()
    DNIValidator.cif_check(data);
  }


  registerAll(){
    this.authService.crearEmpresa(this.registerCompany.value);
    
    this.authService.registerAdmin(
      this.registerAdmin.value,
      this.registerCompany.value.cif
    );

    
  }
}
