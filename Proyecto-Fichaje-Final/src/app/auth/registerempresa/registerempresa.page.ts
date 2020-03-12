import { Component, OnInit, ViewChild, Input, AfterViewInit, AfterViewChecked } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IonSlides, ModalController, NavController } from "@ionic/angular";
import { PhoneValidator } from "../phone.validator";
import { CIFValidator } from "../cif.validator";
import { countryCodes } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { MapaempresaComponent } from './mapaempresa/mapaempresa.component'
import { HttpClient } from '@angular/common/http';
import { DNIValidator } from '../dni.validator';
@Component({
  selector: "app-registerempresa",
  templateUrl: "./registerempresa.page.html",
  styleUrls: ["./registerempresa.page.scss"]
})
export class RegisterempresaPage implements OnInit, AfterViewInit {
  @Input() cif: String;
  @Input() nombreEmpresa: String;
  @Input() latEmpresa: String;
  @Input() lonEmpresa: String;
  @Input() direccionEmpresa: String;

  @Input() nombre: string;
  @Input() DNI: string;
  @Input() telefono: string;
  @Input() email: string;
  @Input() country: string;
  @Input() password: string;
  @Input() horasTrabajo: number;

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
  @ViewChild("slides") slides: IonSlides;

  ngOnInit() {
    console.log('brah')
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
      nombre: ["", Validators.required],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      horasTrabajo: ["", Validators.max(24)]
    });
  }

  ngAfterViewInit() {
    console.log(this.slides)
    this.slides.lockSwipes(true);
  }

  updateAll() {
    PhoneValidator.country_check(this.registerAdmin.value.country);
  }

  closePage() {
    this.navCtrl.pop();
  }




  async openMap() {
    let direccionEncoded = encodeURI(this.registerCompany.value.direccionEmpresa);

    let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/${direccionEncoded}?format=json`).toPromise()

    const latLon = [jsonQ[0].lat, jsonQ[0].lon]

    let modal = await this.modalCtrl.create({
      component: MapaempresaComponent,
      componentProps: { latLon }
    })

    modal.onDidDismiss().then((callback) => {
      this.latEmpresa = callback.data.lat;
      this.lonEmpresa = callback.data.lng;
    })

    await modal.present();

  }

  get cif_() {
    return this.registerCompany.get("cif");
  }

  get direccion_(){
    return this.registerCompany.get("direccionEmpresa");
  }

  get dni_(){
    return this.registerAdmin.get("DNI");
  }

  cif_check(data){
    this.blockSwipeif()
    DNIValidator.cif_check(data);
  }
  
  blockSwipeif() {
    if(this.registerCompany.get("cif").valid){
      this.slides.lockSwipes(false);
    } else{
      this.slides.lockSwipes(true);
    }
  }


  registerAll(){
    this.authService.crearEmpresa(this.registerCompany.value);
    
    this.authService.registerAdmin(
      this.registerAdmin.value,
      this.registerCompany.value.cif
    );

    
  }
}
