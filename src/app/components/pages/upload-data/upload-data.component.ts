import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ExcelService } from 'src/app/services/excel.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {

  constructor(private router: Router, private api: ApiService, private cookie: CookieService, private excelService: ExcelService) { }


  user: any = null
  isLogged: Boolean = null
  changing: Boolean = false
  excel: String = 'Clic o arraste un archivo de excel'
  response: String = '';

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login')
  }
  

  title = 'read-excel-in-angular8';
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  worksheet: any;

  file = new FormControl('');



  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.excel = event.target.files[0].name;

    this.readExcel();
  }
  readExcel() {
    var self = this
    let readFile = new FileReader();
    readFile.onload = (e) => {     
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      self.uploadData(this.worksheet); 
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }
  uploadData(dataFile){

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.changing = true;
    let data = {
      token: this.user.token,
      service: 'upload-data',
      data: Object.entries(dataFile),
      extra: {
        headers: headers
      }

    }
    this.api.c('PREVIEW DATA', data)
    this.api.apiUpload(data).subscribe((r: any) => {
      this.api.c('UPLOAD DATA', r)
      this.changing = false
      this.file.setValue('')
      if (r.status){
        this.response = 'Datos subidos exitosamente'; 
      }else{
        this.response = 'Error al subir datos'; 
      }
    },
    error => {
      this.changing = false;
      if (error.status == 401) {
        this.cookie.set('ud', '')
        this.router.navigate(['/login']);
      } else {
        this.api.c('ERROR UPLOAD DATA', error)
      }

    });
  }


}
