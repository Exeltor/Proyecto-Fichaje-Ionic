import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { from } from 'rxjs';
import { countryCodes } from 'src/environments/environment' 
import { PhoneValidator } from 'src/app/auth/phone.validator'
import { MapaModalComponent } from 'src/app/shared/mapaModal/mapaModal.component';
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
  @Input() country: string;
  @Input() latPersona: any;
  @Input() lonPersona: any;
  paises = countryCodes;
  editingForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.editingForm = this.fb.group({
      email: [this.email, Validators.compose([Validators.email, Validators.required])],
      DNI: [this.DNI, Validators.required],
      country: [this.country, Validators.required],
      telefono: [this.telefono, Validators.compose([PhoneValidator.number_check(), Validators.required])],
      nombre: [this.nombre, Validators.required],
      password: ['', Validators.minLength(6)],
      latPersona: [this.latPersona, Validators.required],
      lonPersona: [this.lonPersona, Validators.required],
      confirmPassword: ['']
    }, {validators : this.passwordMatchValidator});
  }

  async openMap() {
    const latLon = [this.latPersona, this.lonPersona]

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
  get countryCode_(){
    return this.editingForm.get('country');
  }
  updateAll(){
    PhoneValidator.country_check(this.editingForm.value.country);
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch' : true};
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
    return from(this.authService.getSignInMethods().filter(data => (data.providerId == 'facebook.com')));
  }

  googleExists() {
    return from(this.authService.getSignInMethods().filter(data => (data.providerId == 'google.com')));
  }

  onSubmit() {
    this.authService.updateProfile(this.editingForm.value);
  }

}
