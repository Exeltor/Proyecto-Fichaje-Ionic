import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})

export class RecuperarpassPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.authService.recuperarpass(form.value.email);
  }
}

