import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from  "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-nuevo-faro',
  templateUrl: './nuevo-faro.page.html',
  styleUrls: ['./nuevo-faro.page.scss'],
})
export class NUEVOFAROPage implements OnInit {

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
  }

 onSubmit(form : NgForm){
  console.log(form.value.name)
  this.authService.crearPunto(form.value.name, form.value.id, form.value.latpunto, form.value.lonpunto, form.value.type, form.value.intensidad, form.value.carga, form.value.ocupacion)
 }

}
