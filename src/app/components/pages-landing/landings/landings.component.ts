import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-landings',
  templateUrl: './landings.component.html',
  styleUrls: ['./landings.component.scss']
})
export class LandingsComponent implements OnInit {

  user: any = null;
  isLogged: Boolean = null
  changing: Boolean = false
  result: Boolean = false
  dataUsers: any = []
  dataClients: any = []
  amountData: any = ''
  isVisible: Boolean = false
  type: any;
  inputs: any = []
  roles: any = []
  loading: Boolean = false;
  permits: any;
  titleModal: String = ''
  role: any;
  useridPrev: any = null;
  clientidPrev: any = null;
  useridClient: any = null;

  constructor(private router: Router, private api: ApiService, private cookie: CookieService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login-landing')
    this.getUsers()
    this.getClients()
  }

  validateSessionAdmin() {
    if (this.cookie.get('ud') && this.cookie.get('ud') != '') {
      this.user = JSON.parse(this.cookie.get('ud'))
      if (this.user.user.role !== 'admin') {
        this.cookie.set('ud', '');
        this.router.navigate(['/login-landing'])
      } else {
        this.isLogged = true;
      }
    } else {
      this.router.navigate(['/login-landing'])
    }
  }

  openModal(e, id = null) {
    this.type = null
    switch (e) {
      case 'add-user':
        this.type = e
        this.titleModal = 'Agregar Usuario'
        this.getRoles()
        this.inputs = [
          {
            name: 'Nombre',
            key: 'name',
            value: '',
            type: 'text',
            placeholder: 'Ingrese un nombre'
          },
          {
            name: 'Correo',
            key: 'email',
            value: '',
            type: 'text',
            placeholder: 'Ingrese un correo'
          },
          {
            name: 'Contraseña',
            key: 'password',
            value: '',
            type: 'text',
            placeholder: 'Ingrese un contraseña'
          },
          {
            name: 'Permisos',
            key: 'permits',
            type: 'select-multiple',
            placeholder: 'Seleccione los permisos',
            data: [{ label: 'Landing', value: 'landing' }, { label: 'Rut', value: 'rut' }]
          },
          {
            name: 'Rol',
            key: 'role',
            value: '',
            type: 'select',
            placeholder: 'Seleccione el rol'
          },
        ]
        this.showModal()

        break;

      case 'edit-user':
        this.type = e
        this.getUsersByID(id)

        break;

      case 'add-client':
        this.type = e
        this.titleModal = 'Agregar Cliente'
        this.getRoles()
        this.inputs = [
          {
            name: 'Nombre legal',
            key: 'legalname',
            value: '',
            type: 'text',
            placeholder: 'Ingrese nombre legal'
          },
          {
            name: 'Nombre comercial',
            key: 'bussinesname',
            value: '',
            type: 'text',
            placeholder: 'Ingrese nombre comercial'
          },
          {
            name: 'RUT',
            key: 'rut',
            value: '',
            type: 'text',
            placeholder: 'Ingrese rut'
          },
          {
            name: 'Representante legal',
            key: 'legalrepresentative',
            value: '',
            type: 'text',
            placeholder: 'Ingrese el representante'
          },
          {
            name: 'Teléfono',
            key: 'phone',
            value: '',
            type: 'text',
            placeholder: 'Ingrese el teléfono'
          },
          {
            name: 'Dirección',
            key: 'address',
            value: '',
            type: 'text',
            placeholder: 'Ingrese la dirección'
          },
          {
            name: 'Usuario',
            key: 'users',
            value: '',
            type: 'select',
            placeholder: 'Seleccione el usuario'
          },
        ]
        this.showModal()

        break;

      case 'edit-client':
        this.type = e
        this.getClientsByID(id)

        break;


      default:
        break;
    }

  }


  // USERS // 

  getUsers() {
    this.result = false
    this.changing = true
    this.dataUsers = []

    let data = {
      token: this.user.token,
      service: 'getUsers',
    }

    this.api.api(data).subscribe((r: any) => {
      this.api.c('Get Users', r)
      this.changing = false
      this.result = true
      this.dataUsers = r
      this.amountData = 'Registros: ' + r.length;
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET USERS', error)
        }

      });
  }

  getUsersByID(id) {
    this.useridPrev = id
    let data = {
      token: this.user.token,
      userid: id,
      service: 'getUsersByID',
    }
    this.api.api(data).subscribe((r: any) => {
      this.api.c('getUsersByID', r)
      this.titleModal = 'Editar Usuario'
      this.getRoles()
      this.inputs = [
        {
          name: 'Nombre',
          key: 'name',
          value: r.name,
          type: 'text',
          placeholder: 'Ingrese un nombre'
        },
        {
          name: 'Correo',
          key: 'email',
          value: r.email,
          type: 'text',
          placeholder: 'Ingrese un correo'
        },
        {
          name: 'Contraseña',
          key: 'password',
          value: '',
          type: 'text',
          placeholder: 'Ingrese un contraseña'
        },
        {
          name: 'Permisos',
          key: 'permits',
          type: 'select-multiple',
          placeholder: 'Seleccione los permisos',
          data: [{ label: 'Landing', value: 'landing' }, { label: 'Rut', value: 'rut' }]
        },
        {
          name: 'Rol',
          key: 'role',
          type: 'select',
          placeholder: 'Seleccione el rol'
        },
      ]

      if (r.permits) {
        this.permits = r.permits.split(',')
      } else {
        this.permits = []
      }

      if (r.role_id) {
        this.role = '' + r.role_id
      } else {
        this.role = ''
      }
      this.showModal()
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET USERS BY ID', error)
        }
      });
  }

  deleteUser(id) {
    this.changing = true
    let data = {
      token: this.user.token,
      userid: id,
      service: 'deleteUser',
    }
    this.api.api(data).subscribe((r: any) => {
      if (r.status) {
        this.api.c('ADD USER', r)
        this.changing = false
        this.isVisible = false
        this.success('Usuarios', r.message)
        this.getUsers()
      } else {
        this.changing = false
        this.error('Usuarios', r)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR DELETE USER', error)
        }
      });
  }

  getRoles() {

    let data = {
      token: this.user.token,
      service: 'getRoles',
    }
    this.api.api(data).subscribe((r: any) => {
      this.roles = r
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET ROLES', error)
        }
      });

  }

  addUser() {
    this.changing = true;
    let data = {
      token: this.user.token,
      name: $('#name').val(),
      email: $('#email').val(),
      permits: this.permits,
      password: $('#password').val(),
      role: this.role,
      service: 'addUser',
    }
    this.api.api(data).subscribe((r: any) => {

      if (r.status) {
        this.api.c('ADD USER', r)
        this.changing = false
        this.isVisible = false
        this.success('Usuarios', r.message)
        this.getUsers()
      } else {
        this.changing = false
        this.error('Usuarios', r.message)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR ADD USER', error)
        }
      });
  }

  editUser() {
    this.changing = true;
    let data = {
      token: this.user.token,
      name: $('#name').val(),
      email: $('#email').val(),
      permits: this.permits,
      password: $('#password').val(),
      role: this.role,
      userid: this.useridPrev,
      service: 'editUser',
    }

    this.api.c('edituser', data);
    this.api.api(data).subscribe((r: any) => {

      if (r.status) {
        this.api.c('EDIT USER', r)
        this.changing = false
        this.isVisible = false
        this.success('Usuarios', r.message)
        this.getUsers()
      } else {
        this.changing = false
        this.error('Usuarios', r)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR EDIT USER', error)
        }
      });
  }

  // CLIENTS // 

  getClients() {
    this.result = false
    this.changing = true
    this.dataClients = []

    let data = {
      token: this.user.token,
      service: 'getClients',
    }

    this.api.api(data).subscribe((r: any) => {
      this.api.c('Get Clients', r)
      this.changing = false
      this.result = true
      this.dataClients = r
      this.amountData = 'Registros: ' + r.length;
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET CLIENTS', error)
        }

      });
  }

  getClientsByID(id) {
    this.clientidPrev = id
    let data = {
      token: this.user.token,
      clientid: id,
      service: 'getClientsByID',
    }
    this.api.api(data).subscribe((r: any) => {
      this.api.c('getClientsByID', r)
      this.titleModal = 'Editar Cliente'
      this.inputs = [
        {
          name: 'Nombre legal',
          key: 'legalname',
          value: r.legalname,
          type: 'text',
          placeholder: 'Ingrese un nombre'
        },
        {
          name: 'Nombre comercial',
          key: 'bussinesname',
          value: r.bussinesname,
          type: 'text',
          placeholder: 'Ingrese un nombre'
        },
        {
          name: 'Rut',
          key: 'rut',
          value: r.rut,
          type: 'text',
          placeholder: 'Ingrese un rut'
        },
        {
          name: 'Representante legal',
          key: 'legalrepresentative',
          value: r.legalrepresentative,
          type: 'text',
          placeholder: 'Ingrese un representante'
        },
        {
          name: 'Teléfono',
          key: 'phone',
          value: r.phone,
          type: 'text',
          placeholder: 'Ingrese un teléfono'
        },
        {
          name: 'Dirección',
          key: 'address',
          value: r.address,
          type: 'text',
          placeholder: 'Ingrese una dirección'
        },
        {
          name: 'Usuario',
          key: 'userid',
          type: 'select',
        },
      ]

      if (r.userid) {
        this.useridClient = r.userid
      } else {
        this.useridClient = ''
      }


      this.showModal()
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR GET CLIENT BY ID', error)
        }
      });
  }

  deleteClient(id) {
    this.changing = true
    let data = {
      token: this.user.token,
      userid: id,
      service: 'deleteClient',
    }
    this.api.api(data).subscribe((r: any) => {
      if (r.status) {
        this.api.c('DELELE CLIENT', r)
        this.changing = false
        this.isVisible = false
        this.success('Clientes', r.message)
        this.getClients()
      } else {
        this.changing = false
        this.error('Clientes', r)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR DELETE CLIENTS', error)
        }
      });
  }


  addClient() {
    this.changing = true;
    let data = {
      token: this.user.token,
      legalname: $('#legalname').val(),
      bussinesname: $('#bussinesname').val(),
      rut: $('#rut').val(),
      legalrepresentative: $('#legalrepresentative').val(),
      phone: $('#phone').val(),
      address: $('#address').val(),
      userid: this.useridClient,
      service: 'addClient',
    }
    this.api.api(data).subscribe((r: any) => {

      if (r.status) {
        this.api.c('ADD CLIENT', r)
        this.changing = false
        this.isVisible = false
        this.success('Clientes', r.message)
        this.getClients()
      } else {
        this.changing = false
        this.error('Clientes', r.message)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR ADD CLIENT', error)
        }
      });
  }

  editClient() {
    this.changing = true;
    let data = {
      token: this.user.token,
      legalname: $('#legalname').val(),
      bussinesname: $('#bussinesname').val(),
      rut: $('#rut').val(),
      legalrepresentative: $('#legalrepresentative').val(),
      phone: $('#phone').val(),
      address: $('#address').val(),
      userid: this.useridClient,
      clientid: this.clientidPrev,
      service: 'editClient',
    }

    this.api.c('editclient', data);
    this.api.api(data).subscribe((r: any) => {

      if (r.status) {
        this.api.c('EDIT USER', r)
        this.changing = false
        this.isVisible = false
        this.success('Usuarios', r.message)
        this.getClients()
      } else {
        this.changing = false
        this.error('Usuarios', r)
      }
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login-landing']);
        } else {
          this.api.c('ERROR ADD USER', error)
        }
      });
  }





  //MODAL

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    switch (this.type) {
      case 'add-user':
        this.addUser()
        break;
      case 'edit-user':
        this.editUser()
        break;
      case 'add-client':
        this.addClient()
        break;
      case 'edit-client':
        this.editClient()
        break;

      default:
        break;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  info(title, message): void {
    this.modalService.info({
      nzTitle: title,
      nzContent: message,
      nzOnOk: () => console.log('Info OK')
    });
  }

  success(title, message): void {
    this.modalService.success({
      nzTitle: title,
      nzContent: message
    });
  }

  error(title, message): void {
    this.modalService.error({
      nzTitle: title,
      nzContent: message
    });
  }

  warning(title, message): void {
    this.modalService.warning({
      nzTitle: title,
      nzContent: message
    });
  }


  showDeleteConfirm(type, data = null): void {

    switch (type) {
      case 'delete-user':
        this.modalService.confirm({
          nzTitle: 'Seguro que desea eliminar el elemento',
          nzContent: '',
          nzOkText: 'Si',
          nzOkType: 'danger',
          nzOnOk: () => this.deleteUser(data),
          nzCancelText: 'No',
          // nzOnCancel: () => console.log('Cancel')
        });
        break;

      default:
        break;
    }


  }

}

