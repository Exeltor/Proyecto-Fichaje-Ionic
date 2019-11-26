import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { RegisterUserModalComponent } from './register-user-modal/register-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  entryComponents: [RegisterUserModalComponent, EditUserModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePage, RegisterUserModalComponent, EditUserModalComponent]
})
export class ProfilePageModule {}
