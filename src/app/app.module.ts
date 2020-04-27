import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { HeaderComponent } from './components/partials/header/header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ExcelService } from './services/excel.service';
import { UploadDataComponent } from './components/pages/upload-data/upload-data.component';
import { LoginLandingComponent } from './components/auth/login-landing/login-landing.component';
import { DashboardComponent } from './components/pages-landing/dashboard/dashboard.component';
import { HeaderLandingComponent } from './components/partials/header-landing/header-landing.component';
import { UsersComponent } from './components/pages-landing/users/users.component';
import { LandingsComponent } from './components/pages-landing/landings/landings.component';
import { EditLandingComponent } from './components/partials/edit-landing/edit-landing.component';
import { LinkComponent } from './components/partials/inputs/link/link.component';
import { FormComponent } from './components/partials/inputs/form/form.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    UploadDataComponent,
    LoginLandingComponent,
    DashboardComponent,
    HeaderLandingComponent,
    UsersComponent,
    LandingsComponent,
    EditLandingComponent,
    LinkComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzFormModule,
    NzPageHeaderModule,
    NzIconModule,
    NzInputModule,
  ],
  providers: [
    CookieService,
    ExcelService,
    { provide: NZ_I18N, useValue: es_ES },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
