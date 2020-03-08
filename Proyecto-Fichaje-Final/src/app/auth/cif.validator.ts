import { AngularFirestore } from '@angular/fire/firestore';

import { take, debounceTime, map } from 'rxjs/operators';

import { ValidatorFn, AbstractControl } from '@angular/forms';

export class CIFValidator { 
    static cif_check(afs: AngularFirestore): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } => {
        var cif = control.value;
        return afs.collection('empresas').snapshotChanges().pipe(debounceTime(500), take(1), map(items => {
          console.log('mostro');
          items.forEach(item => {
            if (item.payload.doc.id === cif) {
              console.log('invalid')
              return { isValid: false }
            }

            return { isValid: true }
          })
        }))
      };
    }
  }