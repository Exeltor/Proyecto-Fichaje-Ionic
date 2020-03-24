import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ModalController } from "@ionic/angular";
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
  distancia: number;

  nombre: string;
  DNI: string;
  telefono: string;
  email: string;
  country: string;
  password: string;
  horasTrabajo: number;

  horaEntrada;
  horaSalida;
  numPausas;
  timePausa;

  activeIndex = 0;
  registerCompany: FormGroup;
  registerAdmin: FormGroup;
  horarioForm: FormGroup;
  horarios=[];
  paises = countryCodes;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private modalCtrl: ModalController,
    private http: HttpClient
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
      direccionEmpresa: ["", Validators.required],
      distancia: [250, Validators.required],
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

    
    this.horarioForm = this.fb.group({
      horarios: this.fb.array([this.fb.group({
        horaEntrada: ["08:00", Validators.required],
        horaSalida: ["17:00", Validators.required],
        numPausas: ["", Validators.required],
        timePausa: ["", Validators.required]
      })])
    });
  }

  get horarioFormGetter() {
    return this.horarioForm.get('horarios') as FormArray;
  }

  addHorario() {
    this.horarioFormGetter.push(this.fb.group({
      horaEntrada: ["08:00", Validators.required],
      horaSalida: ["17:00", Validators.required],
      numPausas: ["", Validators.required],
      timePausa: ["", Validators.required]
    }));
  }

  removeHorario(index) {
    if (this.horarioFormGetter.length > 1) {
      this.horarioFormGetter.removeAt(index);
    }
  }

  stepForward(stepper: MatStepper) {
    stepper.next();
  }

  stepBackward(stepper: MatStepper) {
    stepper.previous();
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

  cif_check(data){
    DNIValidator.cif_check(data);
  }


  registerAll(){
    this.authService.crearEmpresa(this.registerCompany.value);
    
    this.authService.registerAdmin(
      this.registerAdmin.value,
      this.registerCompany.value.cif
    );
    this.authService.crearHorario(this.horarioForm.value.horarios, this.registerCompany.value.cif);
  }
  
  get horaEntrada_(){
    return this.horarioForm.get("horaEntrada")
  }
  get horaSalida_(){
    return this.horarioForm.get("horaSalida")
  }
  get numPausas_(){
    return this.horarioForm.get("numPausas")
  }
  get timePausa_(){
    return this.horarioForm.get("timePausa")
  }

  get distancia_(){
    return this.registerCompany.get('distancia');
  }
  get personaCoords_() {
    return this.registerAdmin.get('latPersona')
  }

  get direccionPersona_() {
    return this.registerAdmin.get('direccionPersona');
  }

  get empresaCoords_() {
    return this.registerCompany.get('latEmpresa')
  }

  get direccionEmpresa_() {
    return this.registerCompany.get('direccionEmpresa');
  }

  get countryCode_(){
    return this.registerAdmin.get('country');
  }
  
  get cif_() {
    return this.registerCompany.get("cif");
  }

  get dni_(){
    return this.registerAdmin.get("DNI");
  }
}
