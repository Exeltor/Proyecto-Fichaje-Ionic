import { AngularFirestore } from "@angular/fire/firestore";

import { take, debounceTime, map } from "rxjs/operators";

import { ValidatorFn, AbstractControl } from "@angular/forms";

export class CIFValidator {
  static cif_check(afs: AngularFirestore): ValidatorFn {
    return (control: AbstractControl) => {

      const cif = control.value//.toLowerCase();
      return afs.collection('empresas', ref => ref.where('id', '==', cif) )
        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr => arr.length ? { isValid: false } : null ),
        )
    }
  }
}
