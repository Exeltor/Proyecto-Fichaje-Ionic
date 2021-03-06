import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { GoogleMapsAPIWrapper } from '@agm/core';

const routes: Routes = [
  {
    path: "",
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AuthPage, LoginComponent]
})
export class AuthPageModule {}
