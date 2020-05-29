import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CercanosPageRoutingModule } from './cercanos-routing.module';

import { CercanosPage } from './cercanos.page';
import { UinfoPage } from './uinfo/uinfo.page';

@NgModule({
  entryComponents: [UinfoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CercanosPageRoutingModule
  ],
  declarations: [CercanosPage, UinfoPage],
  providers: [FormBuilder]
})
export class CercanosPageModule {}
