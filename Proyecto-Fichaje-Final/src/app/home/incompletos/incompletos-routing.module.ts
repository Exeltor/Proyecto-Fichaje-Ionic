import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncompletosPage } from './incompletos.page';

const routes: Routes = [
  {
    path: '',
    component: IncompletosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncompletosPageRoutingModule {}
