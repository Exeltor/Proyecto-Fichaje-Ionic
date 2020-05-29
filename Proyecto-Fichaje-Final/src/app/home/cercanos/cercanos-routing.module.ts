import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CercanosPage } from './cercanos.page';

const routes: Routes = [
  {
    path: '',
    component: CercanosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CercanosPageRoutingModule {}
