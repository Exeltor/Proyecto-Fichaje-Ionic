import { AbstractControl, ValidatorFn } from "@angular/forms";
import { PhoneNumberUtil } from "google-libphonenumber";
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
const phoneUtil = PhoneNumberUtil.getInstance();

export class PhoneValidator {
  static pais;
  static country_check(data) {
    console.log(data, "country_check");
    this.pais = data;
  }
  static number_check(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      var phone = control.value;
      if (phone.length > 1) {
        const regionCode = phoneUtil.getRegionCodeForCountryCode(this.pais);
        if (regionCode.toUpperCase() === "ZZ") {
          return { isValid: true };
        }
        const phoneNumber = phoneUtil.parse(phone.toString(), regionCode);
        let isValid = phoneUtil.isValidNumber(phoneNumber);
        if (!isValid) {
          return { number_check: { isValid } };
        } else {
          return null;
        }
      } else {
        return { isValid: true };
      }
    };
  }
}
