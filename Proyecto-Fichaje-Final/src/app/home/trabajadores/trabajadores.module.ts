import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajadoresPageRoutingModule } from './trabajadores-routing.module';

import { TrabajadoresPage } from './trabajadores.page';
import { UinfoPage } from './uinfo/uinfo.page';

@NgModule({
  entryComponents: [UinfoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajadoresPageRoutingModule
  ],
  declarations: [TrabajadoresPage, UinfoPage],
  providers: [FormBuilder]
})
export class TrabajadoresPageModule {}
