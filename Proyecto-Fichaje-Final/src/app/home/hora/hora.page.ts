import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
}
