import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NgForm, FormGroup, Validators, FormControl } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { PhoneValidator } from "src/app/home/profile/phone.validator";
import { CountryPhone } from 'src/app/home/profile/country-phone.model';

@Component({
  selector: "app-register-user-modal",
  templateUrl: "./register-user-modal.component.html",
  styleUrls: ["./register-user-modal.component.scss"]
})
export class RegisterUserModalComponent implements OnInit {
  admin = true;
  country_phone_group: FormGroup;
  countries: Array<CountryPhone>;
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.countries = [
      new CountryPhone('UY', 'Uruguay'),
      new CountryPhone('US', 'United States'),
      new CountryPhone('BR', 'Brasil'),
      new CountryPhone('ES', 'Españistán')
    ];
    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit(form: NgForm) {
    const formData = form.value;

    this.authService.registerUser(
      formData.email,
      formData.password,
      formData.nameSurname,
      formData.dni,
      formData.tel,
      formData.hours
    );

    this.modalController.dismiss();
  }
}
