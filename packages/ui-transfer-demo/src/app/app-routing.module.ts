import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectPageComponent } from './pages/connect-page/connect-page.component';
import { DescriptionPageComponent } from './pages/description-page/description-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'description',
    component: DescriptionPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'connect',
    component: ConnectPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'confirm',
    component: ConfirmationPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
