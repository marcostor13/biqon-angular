import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  response = '';

  public isLogged: boolean = false;

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  formLogin: FormGroup;

  constructor(private router: Router, private apiService: ApiService, private cookie: CookieService) {
    this.formLogin = this.createFormGroup();
  }

  ngOnInit() {
    this.verifySession();
  }

  verifySession() {
    if (this.cookie.get('ud') != '') {
      this.isLogged = true;
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {

    this.response = 'Procesando...'
    let data = {
      email: this.formLogin.get('email').value,
      password: this.formLogin.get('password').value,
      service: 'login'
    }
    this.apiService.api(data).subscribe(result => {
      this.cookie.set('ud', JSON.stringify(result));
      this.router.navigate(['/']);
    },
      error => {
        if (error.status == 401) {
          this.response = 'Error en el correo o contraseña'
        } else {
          this.response = JSON.stringify(error);
        }

      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      });

  }

  onResetForm() {
    this.formLogin.reset();
  }

  get email() { return this.formLogin.get('email'); }
  get password() { return this.formLogin.get('password'); }




}
