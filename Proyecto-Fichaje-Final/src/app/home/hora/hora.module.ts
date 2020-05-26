import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UinfoPage } from './uinfo/uinfo.page';
import { IonicModule } from '@ionic/angular';

import { HoraPage } from './hora.page';

const routes: Routes = [
  {
    path: '',
    component: HoraPage
  }
];

@NgModule({
  entryComponents: [UinfoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HoraPage, UinfoPage]
})
export class HoraPageModule {}
