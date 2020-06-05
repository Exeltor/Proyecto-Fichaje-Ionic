import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NUEVOFAROPage } from './nuevo-faro.page';

const routes: Routes = [
  {
    path: '',
    component: NUEVOFAROPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NUEVOFAROPageRoutingModule {}
