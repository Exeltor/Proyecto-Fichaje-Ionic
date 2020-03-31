import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CamaraPageRoutingModule } from './camara-routing.module';

import { CamaraPage } from './camara.page';

import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CamaraPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [CamaraPage],
  providers:[
  ]
})
export class CamaraPageModule {}
