import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.registerAdmin(form.value.email,
    form.value.password, 
    form.value.nameSurname, 
    form.value.dni, 
    form.value.tel, 
    form.value.hours);
  }

}
