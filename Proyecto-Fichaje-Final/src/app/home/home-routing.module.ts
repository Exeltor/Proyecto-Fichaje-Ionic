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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}