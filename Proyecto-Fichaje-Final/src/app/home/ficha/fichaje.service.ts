import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FichajeService {

  constructor(private afs: AngularFirestore) { }
}
