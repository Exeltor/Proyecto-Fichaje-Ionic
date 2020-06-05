import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoFaroPage } from './nuevo-faro.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoFaroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoFaroPageRoutingModule {}
