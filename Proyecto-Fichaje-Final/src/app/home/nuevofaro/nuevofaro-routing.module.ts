import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevofaroPage } from './nuevofaro.page';

const routes: Routes = [
  {
    path: '',
    component: NuevofaroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevofaroPageRoutingModule {}
