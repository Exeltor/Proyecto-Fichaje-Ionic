import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', pathMatch: 'full'},
  { path: 'second-page', loadChildren: './second-page/second-page.module#SecondPagePageModule', pathMatch: 'full' },
  { path: 'home/:mostro', loadChildren: './home/pagina-dinamica/pagina-dinamica.module#PaginaDinamicaPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
