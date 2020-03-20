import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLanding = () => redirectUnauthorizedTo(['auth']);
const redirectAuthorizedToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLanding }},
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule', canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuthorizedToHome } },
  { path: 'registerempresa', loadChildren: './auth/registerempresa/registerempresa.module#RegisterempresaPageModule' },
  {
    path: 'recuperarpass',
    loadChildren: () => import('./auth/recuperarpass/recuperarpass.module').then( m => m.RecuperarpassPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
