import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UinfoPage } from './uinfo.page';

import { AccordionModule } from 'ngx-bootstrap/accordion';

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
    FormBuilder,
    AccordionModule.forRoot()
  ],
  declarations: [UinfoPage],
  providers:[ FormBuilder]
})
export class UinfoPageModule {}
