import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HoraPage } from './hora.page';

import { CalendarModule } from 'ion2-calendar';


const routes: Routes = [
  {
    path: '',
    component: HoraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HoraPage]
})
export class HoraPageModule {}
