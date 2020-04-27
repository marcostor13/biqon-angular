import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { id_ID } from 'ng-zorro-antd';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any = []
  user: any = null
  isLogged: Boolean = null
  changing: Boolean = false
  dataDashboard: any []
  result: Boolean = false

  Between: String = 'Between'
  name: String = ''
  phone: String = ''
  comuna: String = ''
  region: String = ''
  rut: String = ''
  rutList: any = ''
  from: any = ''
  to: any = ''
  amountData: any = ''
  totalRut: any = ''
  amountDataUnique: any = []
  totalPhone: any = ''
  totaRegion: any = ''
  isVisible: Boolean = false
  titleModal: String = ''
  addressList: any = []

  listOfData:any = []

  constructor(private router: Router, private api: ApiService, private cookie: CookieService, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login');
  }  

  getData() {
    this.result = false
    this.changing = true;
    let d = {
      Between: this.Between,
      name: this.name,
      phone: this.phone,
      comuna: this.comuna,
      region: this.region,
      rut: this.rut,
      rutList: this.rutList,
      from: this.from,
      to: this.to,
    }
    let data = {
      token: this.user.token,
      service: 'getDataDashboard',
      data : d,
    }

    this.api.c(' PREVIEW DATA', data)
    this.api.api(data).subscribe((r: any) => {
      this.api.c('GET DATA', r)
      this.changing = false
      this.result = true
      this.listOfData = this.orderTableByPhone(r)
      this.api.c('GET DATA CHANGED', this.listOfData)
      this.totalRut= r.length
      this.amountData = 'Total: ' + r.length + ' contactos'
      this.getUnique(r, 'RUT')
      this.getUnique(r, 'TELEFONO')
      this.getUnique(r, 'REGION')
      this.data = r
    },
      error => {
        this.changing = false;
        if (error.status == 401) {
          this.cookie.set('ud', '')
          this.router.navigate(['/login']);
        } else {
          this.api.c('ERROR GET DATA DASHBOARD', error)
        }

      });
  }

  orderTableByPhone(e){
    var count
    var res = []
    
    e.forEach(element => {

      if (res.length > 0) {

        for (let i = 0; i < res.length; i++) {
          if (element.COMUNA == res[i].COMUNA && element.REGION == res[i].REGION && element.TELEFONO == res[i].TELEFONO) {  // SI SE ENCUENTRA AL ELEMENTO
            
            if (res[i].DIRECCION.indexOf(element.DIRECCION.trim()) == -1){
              res[i].DIRECCION.push(element.DIRECCION)
            }
            
            break;
          } else {  // SI NO SE ENCUENTRA AL ELEMENTO
            if (i == res.length-1) {
              res.push({
                ID: element.ID,
                RUT: element.RUT,
                DV: element.DV,
                NOMBRE: element.NOMBRE,
                COD_AREA: element.COD_AREA,
                TELEFONO: element.TELEFONO,
                DIRECCION: [element.DIRECCION],
                COMUNA: element.COMUNA,
                REGION: element.REGION
              });
            }
          }
          
        }        
      }else{ // SI RES ES === 0 
        res.push({
          ID : element.ID,
          RUT : element.RUT,
          DV : element.DV,
          NOMBRE : element.NOMBRE,
          COD_AREA : element.COD_AREA,
          TELEFONO : element.TELEFONO,
          DIRECCION : [element.DIRECCION],
          COMUNA : element.COMUNA,
          REGION : element.REGION
        });
      }
      

    });
    return res;

  }

  

  getUnique(r, type){
    var i=0; 
    var ruts = []; 
    var res = [];
    r.forEach(e => {
      ruts.push(e[type]); 
      i++
      if(r.length == i){        
        var x = 0; 
        ruts.forEach(element => {
          x++
          if(res.indexOf(element) == -1){            
            res.push(element);   
          }
          if (x == ruts.length) {
            this.amountDataUnique[type] = res.length;
          }
        });
      }
    });

  }



  onKeyUp(e){

    if(e == 'rut'){
      this.from = '';
      this.to = '';
      this.rutList = '';
    }else if(e == 'rutList'){
      this.from = '';
      this.to = '';
      this.rut = '';
    } else if (e == 'to' || e=='from') {
      this.rutList = '';
      this.rut = '';
    }


  }

  exportAsXLSX(): void {
    
    let data = []
    let i = 0; 

    this.listOfData.forEach(e => {
      e.DIRECCION = JSON.stringify(e.DIRECCION);
      data.push(e);
      i++
      if(i == this.listOfData.length){
        this.excelService.exportAsExcelFile(data, 'sample');
      }
    });
    
    
    
  }


  viewAddress(address){
    this.isVisible = true;
    this.addressList = address
  }

  handleCancel(){
    this.isVisible = false;
  }

 

}
