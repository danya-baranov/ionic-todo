import { RouteConstants } from './constans-routing';
import { NgModule, OnInit } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: RouteConstants.loginPage, loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule) },
  { path: RouteConstants.itemDetailsPage, loadChildren: './pages/item-details/item-details.module#ItemDetailsPageModule' },
  { path: RouteConstants.homePage, loadChildren: './pages/home/home.module#HomePageModule' },
  { path: RouteConstants.geolocationPage, loadChildren: './pages/geolocation/geolocation.module#GeolocationPageModule' },
  { path: RouteConstants.registerPage, loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
