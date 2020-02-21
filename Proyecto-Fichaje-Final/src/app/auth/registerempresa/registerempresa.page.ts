import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registerempresa',
  templateUrl: './registerempresa.page.html',
  styleUrls: ['./registerempresa.page.scss'],
})
export class RegisterempresaPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log("El telefono es:" + form.value.tel);

    this.authService.crearEmpresa(
    form.value.cif,
    form.value.nombre,
    form.value.loc1,
    form.value.loc2);

    this.authService.registerAdmin(
    form.value.email,
    form.value.password,
    form.value.nameSurname,
    form.value.hours,
    form.value.dni,
    form.value.tel,
    form.value.cif,
    form.value.code);
    
    this.exit();
  }
  exit(){
    this.router.navigateByUrl('/auth');
  }

}
