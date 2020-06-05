import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RadiofarosPageRoutingModule } from './radiofaros-routing.module';

import { RadiofarosPage } from './radiofaros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadiofarosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RadiofarosPage]
})
export class RadiofarosPageModule {}
