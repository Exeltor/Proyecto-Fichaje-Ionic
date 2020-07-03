import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { IncompletosPageRoutingModule } from './incompletos-routing.module';

import { IncompletosPage } from './incompletos.page';


@NgModule({
  entryComponents: [EditUserModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IncompletosPageRoutingModule
  ],
  declarations: [IncompletosPage,EditUserModalComponent],
  providers: [FormBuilder]
})
export class IncompletosPageModule {}
