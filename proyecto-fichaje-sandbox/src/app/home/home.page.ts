import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private userService: UserServiceService, private loadingController: LoadingController) {}

  toSecondPage() {
    this.router.navigateByUrl('/second-page');
  }

  onSubmit(form: NgForm) {
    this.userService.setUser(form.value.user);
    // Controlador de carga
    this.loadingController.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();
      // Simulacion espera 5 segundos
      setTimeout(() => {
        loadingEl.dismiss();
      }, 5000);
      this.router.navigateByUrl('/second-page');
    });
  }

}
