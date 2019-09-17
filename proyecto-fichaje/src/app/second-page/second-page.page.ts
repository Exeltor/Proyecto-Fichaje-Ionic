import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.page.html',
  styleUrls: ['./second-page.page.scss'],
})
export class SecondPagePage implements OnInit {
  username: string;

  constructor(private userService: UserServiceService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUserFromService();
  }

  getUserFromService() {
    this.username = this.userService.getUser();
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

}
