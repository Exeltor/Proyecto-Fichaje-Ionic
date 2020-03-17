import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { from } from 'rxjs';
import { countryCodes } from 'src/environments/environment' 
import { PhoneValidator } from 'src/app/auth/phone.validator'
@Component({
  selector: 'app-edit-business-modal',
  templateUrl: './edit-business-modal.component.html',
  styleUrls: ['./edit-business-modal.component.scss'],
})
export class EditBusinessModalComponent implements OnInit {
  @Input() Nombre: string;
  @Input() CIF: string;
  @Input() loc1: string;
  @Input() loc2: string;
  // paises = countryCodes;
  editingForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder, public authService: AuthService) { }

  //Añadir validators mas adelante
  
  ngOnInit() {
    // this.countryUpdate(this.country)
    this.editingForm = this.fb.group({
      Nombre: [this.Nombre, Validators.required],
      CIF: [this.CIF, Validators.required],
      loc1: [this.loc1, Validators.required],
      loc2: [this.loc2, Validators.required]
    });
  }
  // , {validators : this.passwordMatchValidator}

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
     this.authService.updateBusiness(this.editingForm.value);
   }

}
