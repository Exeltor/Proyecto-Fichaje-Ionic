import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UinfoPage } from './uinfo.page';


const routes: Routes = [
  {
    path: '',
    component: UinfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormBuilder
  ],
  declarations: [UinfoPage],
  providers:[ FormBuilder]
})
export class UinfoPageModule {}
