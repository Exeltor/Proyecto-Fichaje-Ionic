import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevofaroPageRoutingModule } from './nuevofaro-routing.module';

import { NuevofaroPage } from './nuevofaro.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevofaroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NuevofaroPage]
})
export class NuevofaroPageModule {}
