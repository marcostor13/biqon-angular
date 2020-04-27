import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { UploadDataComponent } from './components/pages/upload-data/upload-data.component';
import { LoginLandingComponent } from './components/auth/login-landing/login-landing.component';
import { DashboardComponent } from './components/pages-landing/dashboard/dashboard.component';
import { UsersComponent } from './components/pages-landing/users/users.component';
import { LandingsComponent } from './components/pages-landing/landings/landings.component';
import { EditLandingComponent } from './components/partials/edit-landing/edit-landing.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'login-landing', component: LoginLandingComponent, pathMatch: 'full' },
  { path: 'upload-data', component: UploadDataComponent, pathMatch: 'full' },
  { path: 'dashboard-landing', component: DashboardComponent, pathMatch: 'full' },
  { path: 'users', component: UsersComponent, pathMatch: 'full' },
  { path: 'landings', component: LandingsComponent, pathMatch: 'full' },
  { path: 'edit-landing/:id', component: EditLandingComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
