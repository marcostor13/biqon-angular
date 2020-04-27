import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-landing',
  templateUrl: './header-landing.component.html',
  styleUrls: ['./header-landing.component.scss']
})

export class HeaderLandingComponent implements OnInit {

  @Input() source: string;

  user: any = null;
  isLogged: Boolean = null;
  isAdmin: Boolean = null; 

  constructor(private router: Router, private api: ApiService, private cookie: CookieService) { }

  ngOnInit(): void {
    this.user = this.api.validateSessionAdminOrLanding('login-landing')    
    this.isAdminValidate()
  }

  isAdminValidate() {
    if (this.user.user.role === 'admin') {
      this.isAdmin = true;
    }
  }  

  logout() {
    let data = {
      token: this.user.token,
      service: 'logout'
    }
    this.api.api(data).subscribe((r: any) => {
      this.api.c('logout', r)
      if (r.success) {
        this.cookie.set('ud', '')
        this.router.navigate(['/login-landing']);
      }
    },
      error => {
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET DATA DASHBOARD', error)
        }

      });
  }



}
