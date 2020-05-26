import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.authService.login(form.value.email, form.value.password);
  }
  
  google() {
    this.authService.signInWithGoogle();
  }

  facebook() {
    this.authService.signInWithFacebook();
  }
}
