import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaPage } from './ficha.page';
import { DescansosPopoverComponent } from './descansos-popover/descansos-popover.component';

const routes: Routes = [
  {
    path: '',
    component: FichaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaPage, DescansosPopoverComponent]
})
export class FichaPageModule {}
