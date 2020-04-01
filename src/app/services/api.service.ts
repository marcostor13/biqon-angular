import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = ''; // disponer url de su servidor que tiene las páginas PHP

  constructor(private http: HttpClient, private cookie: CookieService) {
    if (window.location.href.indexOf('35.238.14.128') > -1 || window.location.href.indexOf('binteraction.cl') > -1) {
      this.url = 'http://binteractionbackend.tk/api/';
    } else {
      this.url = 'http://localhost:8000/api/';
    }
  }



  api(datos) {
    return this.http.post(`${this.url + datos.service}`, datos);
  }

  // apiUpload(datos) {
  //   return this.http.post(`${this.url + datos.service}`, datos.data, datos.extra);
  // }

  // addJob(datos) {
  //   return this.http.post(`${this.url + datos.service}`, datos, datos.extra);
  // }


  c(title, message) {
    console.log('%c' + title + '%c=>', "background-color: purple; color:white;font-family:system-ui;font-size:10pt;font-weight:bold;padding: 4px", "background-color: white; color:purple;font-size:10pt;font-weight:bold;padding: 4px", message);
  }


}
