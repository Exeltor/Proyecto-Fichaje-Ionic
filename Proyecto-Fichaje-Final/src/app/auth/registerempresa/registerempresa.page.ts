import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuthService } from "../auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { PhoneValidator, CIFValidator } from "../phone.validator";
import { countryCodes } from "src/environments/environment";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-registerempresa",
  templateUrl: "./registerempresa.page.html",
  styleUrls: ["./registerempresa.page.scss"]
})
export class RegisterempresaPage implements OnInit {
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
  showSlides = false;
  registerCompany: FormGroup;
  registerAdmin: FormGroup;
  paises = countryCodes;
  constructor(private authService: AuthService, private fb: FormBuilder) {}
  @ViewChild("slides") slides: IonSlides;

  ngOnInit() {
    this.registerCompany = this.fb.group({
      cif: ["", CIFValidator.cif_check()],
      nombreEmpresa: ["", Validators.required],
      latEmpresa: ["", Validators.required],
      lonEmpresa: ["", Validators.required],
      direccionEmpresa: ["", Validators.required]
    });

    this.registerAdmin = this.fb.group({
      email: ["", Validators.compose([Validators.email, Validators.required])],
      DNI: ["", Validators.required],
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
  ionViewDidEnter() {
    this.showSlides = true;
  }
  ionViewDidLeave() {
    this.showSlides = false;
  }
  updateAll() {
    PhoneValidator.country_check(this.registerAdmin.value.country);
  }

  registerEmpresa() {
    //this.authService.crearEmpresa(this.registerCompany.value);
  }

  registerAdministrador() {
    this.authService.registerAdmin(
      this.registerAdmin.value,
      this.registerCompany.value.cif
    );
  }

  blockSwipeif(){
    switch (this.activeIndex) {
      case 0:
        console.log("Registro empresa");
        break;
      case 1:
        console.log("Mapa");
        break;
      case 2:
        console.log("Registro Admin");
        break;
      default:
        break;
    }
  }
  slideChanged() {
    this.slides.getActiveIndex().then(val => {
      this.activeIndex = val;
    });
    this.authService.prueba();
    
  }

  
}
