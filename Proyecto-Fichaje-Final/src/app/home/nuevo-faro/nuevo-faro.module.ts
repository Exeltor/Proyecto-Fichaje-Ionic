import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoFaroPageRoutingModule } from './nuevo-faro-routing.module';

import { NuevoFaroPage } from './nuevo-faro.page';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatStepperModule,
    ReactiveFormsModule,
    NuevoFaroPageRoutingModule
  ],
  declarations: [NuevoFaroPage]
})
export class NuevoFaroPageModule {}
