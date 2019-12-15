import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { UserServiceService } from "../user-service.service";
import { LoadingController } from "@ionic/angular";
import { PhoneNumberUtil } from 'google-libphonenumber';
//const phoneUtil = require('google-libphonenumber')
const phoneValidator = PhoneNumberUtil.getInstance();
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  ngOnInit() {}

  constructor(
    private router: Router,
    private userService: UserServiceService,
    private loadingController: LoadingController
  ) {}

  toSecondPage() {
    this.router.navigateByUrl("/second-page");
  }

  onSubmit(form: NgForm) {
    this.userService.setUser(form.value.user);
    // Controlador de carga
    this.loadingController
      .create({ keyboardClose: true, message: "Logging in..." })
      .then(loadingEl => {
        loadingEl.present();
        // Simulacion espera 5 segundos
        setTimeout(() => {
          loadingEl.dismiss();
        }, 5000);
        this.router.navigateByUrl("/second-page");
      });
  }

  phonenumber(forms: NgForm) {
    var phone = forms.form.value.number.toString();
    console.log(phone);
    var country_code = 34;
    const regionCode = phoneValidator.getRegionCodeForCountryCode(country_code);

    if (regionCode.toUpperCase() === "ZZ") {
      return false;
    }

    console.log("REGION CODE: ", regionCode);

    const phoneNumber = phoneValidator.parse(phone, regionCode);

    console.log("IS PHONE VALID: ", phoneValidator.isValidNumber(phoneNumber));
    console.log("PHONE NUMBER TYPE: ", phoneValidator.getNumberType(phoneNumber));
  }
}
