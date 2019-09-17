import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private userService: UserServiceService) {}

  toSecondPage() {
    this.router.navigateByUrl('/second-page');
  }

  onSubmit(form: NgForm) {
    this.userService.setUser(form.value.user);
    this.router.navigateByUrl('/second-page');
  }

}
