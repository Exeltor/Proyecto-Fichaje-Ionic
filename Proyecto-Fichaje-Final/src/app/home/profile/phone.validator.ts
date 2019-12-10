import { AbstractControl, ValidatorFn } from '@angular/forms';
import libphonenumber from 'google-libphonenumber';

export class PhoneValidator {

	static validCountryPhone = (countryControl: AbstractControl): ValidatorFn => {
    let subscribe: boolean = false;

    return (phoneControl: AbstractControl): {[key: string]: boolean} => {
      if (!subscribe) {
        subscribe = true;
        countryControl.valueChanges.subscribe(() => {
          phoneControl.updateValueAndValidity();
        });
      }
      if(phoneControl.value !== ""){
        try{
          const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
          let phoneNumber = "" + phoneControl.value + "",
              region = countryControl.value.iso,
              number = phoneUtil.parse(phoneNumber, region),
              isValidNumber = phoneUtil.isValidNumber(number);
          if(isValidNumber){
            return null;
          }
        }catch(e){
          return {
            validCountryPhone: true
          };
        }
        return {
          validCountryPhone: true
        };
      }
      else{
        return null;
      }
    };
  };
}