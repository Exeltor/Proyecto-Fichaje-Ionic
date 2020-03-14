import { AngularFirestore } from "@angular/fire/firestore";
import { take, debounceTime, map } from "rxjs/operators";
import { ValidatorFn, AbstractControl } from "@angular/forms";

export class DNIValidator {
  static cif;
  static cif_check(cif){
    this.cif = cif
  }
  static dni_check(afs: AngularFirestore): ValidatorFn {
    return (control: AbstractControl) => {
      const dni = control.value; //.toLowerCase();
      console.log(this.cif);
      return afs
        .collection("empresasPendientes", ref => ref.where("dni", "==", dni).where("cif", "==", this.cif))
        .valueChanges()
        .pipe(
          debounceTime(500),
          take(1),
          map(arr => arr.length ? null : { isValid: true }));
    };
  }
}
