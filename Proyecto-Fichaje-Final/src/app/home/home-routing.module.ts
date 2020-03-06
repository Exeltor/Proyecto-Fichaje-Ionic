import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";

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
            loadChildren: "./trabajadores/trabajadores.module#TrabajadoresPageModule"
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
  { path: 'uinfo', loadChildren: './hora/uinfo/uinfo.module#UinfoPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
