import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: "tabs",
    component: HomePage,
    children: [
      {
        path: "profile",
        children: [
          {
            path: "",
            loadChildren: "./profile/profile.module#ProfilePageModule"
          }
        ]
      },
      {
        path: "ficha",
        children: [
          {
            path: "",
            loadChildren: "./ficha/ficha.module#FichaPageModule"
          }
        ]
      },
      {
        path: "hora",
        children: [
          {
            path: "",
            loadChildren: "./hora/hora.module#HoraPageModule"
          }
        ]
      },
      {
        path: "trabajadores",
        children: [
          {
            path: "",
            loadChildren: "./trabajadores/trabajadores.module#TrabajadoresPageModule",
            canActivate: [AdminGuard]
          }
        ]
      },
      {
        path: "nuevofaro",
        children: [
          {
            path: "",
            loadChildren: "./nuevofaro/nuevofaro.module#NuevofaroPageModule",
            canActivate: [AdminGuard]
          }
        ]
      },
      {
        path: "",
        redirectTo: "/home/tabs/profile",
        pathMatch: "full"
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/profile',
    pathMatch: 'full'
  },
  { path: 'uinfo', loadChildren: './trabajadores/uinfo/uinfo.module#UinfoPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
