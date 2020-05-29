import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UinfoPage } from './uinfo.page';
import { CroppingModalComponent } from 'src/app/shared/cropping-modal/cropping-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: '',
    component: UinfoPage
  }
];

@NgModule({
  entryComponents: [CroppingModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormBuilder,
    ImageCropperModule
  ],
  declarations: [UinfoPage, CroppingModalComponent],
  providers:[ FormBuilder]
})
export class UinfoPageModule {}
