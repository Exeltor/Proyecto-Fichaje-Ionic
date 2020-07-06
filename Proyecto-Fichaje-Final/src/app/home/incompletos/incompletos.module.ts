import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncompletosPageRoutingModule } from './incompletos-routing.module';

import { IncompletosPage } from './incompletos.page';
import { UinfoPage } from './uinfo/uinfo.page';

@NgModule({
  entryComponents: [UinfoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncompletosPageRoutingModule
  ],
  declarations: [IncompletosPage, UinfoPage],
  providers: [FormBuilder]
})
export class IncompletosPageModule {}
