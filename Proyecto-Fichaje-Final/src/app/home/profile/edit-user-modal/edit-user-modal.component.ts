import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { from } from 'rxjs';
import { countryCodes } from 'src/environments/environment' 
import { PhoneValidator } from 'src/app/auth/phone.validator'
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
  paises = countryCodes;
  editingForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.countryUpdate(this.country)
    this.editingForm = this.fb.group({
      email: [this.email, Validators.compose([Validators.email, Validators.required])],
      DNI: [this.DNI, Validators.required],
      country: [this.country, Validators.required],
      telefono: [this.telefono, Validators.compose([PhoneValidator.number_check(), Validators.required])],
      nombre: [this.nombre, Validators.required],
      password: ['', Validators.minLength(6)],
      confirmPassword: ['']
    }, {validators : this.passwordMatchValidator});
  }

  countryUpdate(data){
    PhoneValidator.country_check(data);
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
