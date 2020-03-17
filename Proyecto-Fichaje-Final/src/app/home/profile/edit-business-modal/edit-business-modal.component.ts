import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { from } from "rxjs";
import { PhoneValidator } from "src/app/auth/phone.validator";
import { MapaModalComponent } from 'src/app/shared/mapaModal/mapaModal.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: "app-edit-business-modal",
  templateUrl: "./edit-business-modal.component.html",
  styleUrls: ["./edit-business-modal.component.scss"]
})
export class EditBusinessModalComponent implements OnInit {
  @Input() Nombre: string;
  @Input() CIF: string;
  @Input() latEmpresa: string;
  @Input() lonEmpresa: string;
  @Input() distancia: number;
  editingForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.editingForm = this.fb.group({
      Nombre: [this.Nombre, Validators.required],
      CIF: [this.CIF, Validators.required],
      latEmpresa: [this.latEmpresa, Validators.required],
      lonEmpresa: [this.lonEmpresa, Validators.required],
      direccion: ['', null],
      distancia: [this.distancia, Validators.required]
    });
  }

  countryUpdate(data) {
    PhoneValidator.country_check(data);
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls["password"].value ===
      frm.controls["confirmPassword"].value
      ? null
      : { mismatch: true };
  }

  async openMap() {
    let latLon = [];
    if(this.editingForm.value.direccion == ''){
      latLon = [this.latEmpresa, this.lonEmpresa]
    } else{
      let direccionEncoded = encodeURI(this.editingForm.value.direccion);

      let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/${direccionEncoded}?format=json`).toPromise()

      latLon = [jsonQ[0].lat, jsonQ[0].lon]
    }

    let modal = await this.modalController.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Marca la localizacion' }
    })

    modal.onDidDismiss().then((callback) => {
      if (callback.data === undefined) return;
      this.latEmpresa = callback.data.lat;
      this.lonEmpresa = callback.data.lng;
    })

    await modal.present();
  }
  
  modalDismiss() {
    this.modalController.dismiss();
  }

  linkWithFacebook() {
    this.authService.linkWithFacebook();
  }

  linkWithGoogle() {
    this.authService.linkWithGoogle();
  }

  facebookExists() {
    return from(
      this.authService
        .getSignInMethods()
        .filter(data => data.providerId == "facebook.com")
    );
  }

  googleExists() {
    return from(
      this.authService
        .getSignInMethods()
        .filter(data => data.providerId == "google.com")
    );
  }

  onSubmit() {
    this.authService.updateBusiness(this.editingForm.value);
  }

  get empresaCoords_ () {
    return this.editingForm.get("latEmpresa")
  }
  get empresaDireccion_ () {
    return this.editingForm.get("direccion")
  }
  get distancia_ () {
    return this.editingForm.get("distancia")
  }
}
