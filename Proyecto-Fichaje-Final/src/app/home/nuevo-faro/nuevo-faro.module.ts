import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NUEVOFAROPageRoutingModule } from './nuevo-faro-routing.module';

import { NUEVOFAROPage } from './nuevo-faro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NUEVOFAROPageRoutingModule
  ],
  declarations: [NUEVOFAROPage]
})
export class NUEVOFAROPageModule {}
