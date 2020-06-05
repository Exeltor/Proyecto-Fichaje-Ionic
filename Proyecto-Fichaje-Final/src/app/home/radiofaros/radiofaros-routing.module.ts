import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RadiofarosPage } from './radiofaros.page';

const routes: Routes = [
  {
    path: '',
    component: RadiofarosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadiofarosPageRoutingModule {}
