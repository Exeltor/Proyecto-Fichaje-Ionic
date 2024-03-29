import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';

import { IonicModule } from '@ionic/angular';

import { RegisterempresaPage } from './registerempresa.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterempresaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterempresaPage], 
})
export class RegisterempresaPageModule {}
