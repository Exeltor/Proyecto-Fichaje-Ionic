import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CercanosPageRoutingModule } from './cercanos-routing.module';

import { CercanosPage } from './cercanos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CercanosPageRoutingModule
  ],
  declarations: [CercanosPage]
})
export class CercanosPageModule {}
