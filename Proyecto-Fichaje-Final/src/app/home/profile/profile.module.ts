import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { EditBusinessModalComponent } from './edit-business-modal/edit-business-modal.component';
import { AddHorarioModalComponent } from './add-horario-modal/add-horario-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CroppingModalComponent } from 'src/app/shared/cropping-modal/cropping-modal.component';
const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  entryComponents: [RegisterUserModalComponent, EditUserModalComponent, EditBusinessModalComponent, AddHorarioModalComponent, CroppingModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ImageCropperModule
  ],
  declarations: [ProfilePage, RegisterUserModalComponent, EditUserModalComponent, EditBusinessModalComponent, AddHorarioModalComponent, CroppingModalComponent]
})
export class ProfilePageModule {}
