import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: any = null;
  isLogged: Boolean = null;

  active1: Boolean = false;
  active2: Boolean = false;

  constructor(private router: Router, private api: ApiService, private cookie: CookieService) { }

  ngOnInit(): void {
    this.validateSession()
    this.validateActiveMenu()
  }

  validateActiveMenu(){
    let path = window.location.pathname; 

    if (path.indexOf('upload-data')>-1){
      this.active1 = false
      this.active2 = true
    }else{
      this.active2 = false
      this.active1 = true
    }
  }

  validateSession() {
    if (this.cookie.get('ud') && this.cookie.get('ud') != '') {
      this.user = JSON.parse(this.cookie.get('ud'));
      this.api.c('USER DATA', this.user);
      this.isLogged = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    let data = {
      token: this.user.token,
      service: 'logout'
    }
    this.api.api(data).subscribe((r: any) => {
      this.api.c('logout', r)
      if (r.success){
        this.cookie.set('ud', '')
        this.router.navigate(['/login']);
      }
    },
      error => {
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login']);
        } else {
          this.api.c('ERROR GET DATA DASHBOARD', error)
        }

      });
  }

 

}
