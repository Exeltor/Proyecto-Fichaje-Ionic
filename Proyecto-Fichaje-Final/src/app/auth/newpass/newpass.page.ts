import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-newpass',
  templateUrl: './newpass.page.html',
  styleUrls: ['./newpass.page.scss'],
})
export class NewpassPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.newpass(form.value.code, form.value.newpassword, form.value.repeatpassword);
  }
}
