import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevofaroPageRoutingModule } from './nuevofaro-routing.module';

import { NuevofaroPage } from './nuevofaro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevofaroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NuevofaroPage],
  providers: [FormBuilder]
})
export class NuevofaroPageModule {}
