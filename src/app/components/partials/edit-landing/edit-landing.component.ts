import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NzModalService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'app-edit-landing',
  templateUrl: './edit-landing.component.html',
  styleUrls: ['./edit-landing.component.scss']
})
export class EditLandingComponent implements OnInit {

  user: any = null;
  isLogged: Boolean = null
  changing: Boolean = false
  result: Boolean = false
  titlePage: String = 'Crear landing'
  id: any = ''
  nameInputFileLogo: String = 'Clic o arrastre una imagen png'
  nameInputFileBackground: String = 'Clic o arrastre una imagen'
  fileToUpload: File = null
  isVisible: Boolean = false
  type: any
  inputs: any = []
  dataUsers: any = []
  element: any = null
  typeElement: any = null
  disabledSave: Boolean = true
  dataInputsComponent: any = null
  disabledCreateLanding: Boolean = true
  arrayElements: any = []
  dataInput: any;
  titleModal: String = 'Agregar elemento'
  idInputEdit: any = null

  //INPUTS

  name = new FormControl('')
  logoUrl = new FormControl('')
  logoUpload = new FormControl('')
  backgroundImageUrl = new FormControl('')
  backgroundImageUpload = new FormControl('')
  opacity = new FormControl('')
  

  constructor(public route: ActivatedRoute, private router: Router, private api: ApiService, private cookie: CookieService, private modalService: NzModalService, private general: GeneralService) {
    this.id = this.route.snapshot.paramMap.get('id')
   }

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login-landing')

    if (this.id != '0'){
      this.titlePage = 'Editar landing'
    }
    

  }

  //INPUTS 
  saveInput(){
    this.api.c('SAVE INPUT', this.dataInputsComponent)
    this.api.c('SAVE INPUT ELEEMNT', this.element)
    this.api.c('SAVE INPUT idInputEdit', this.idInputEdit)

    if (this.idInputEdit !== null){ //EDIT ELEMENT BY INDEX
      this.arrayElements[this.idInputEdit] = this.eventElements(this.element, this.dataInputsComponent) 
      this.handleCancel();     
    }else{  //ADD NEW ELEMENT
      this.arrayElements.push(this.eventElements(this.element, this.dataInputsComponent)) 
    }
       
    this.api.c('RESULT SAVE INPUTS', this.arrayElements)
    this.updateArray();
    this.isVisible = false
    
    
  }

  updateArray(){
    let array = this.arrayElements;
    this.arrayElements = [];
    array.forEach(e => {
      this.arrayElements.push(e)
    });
  }

  addInput(){
    this.titleModal = 'Editar Modal'
    this.resetInputModal()
    this.showModal()
  }

  resetInputModal(){
    this.element = null
    this.typeElement = null
    this.idInputEdit = null
    this.dataInput = null
    this.dataInputsComponent = null
  }
  
  
  editInput(e, index){
    this.api.c('editInput', e)
    this.api.c('editInput Index', index)
    this.typeElement = e.type
    this.element = e.type
    this.dataInput = e.originElements
    this.titleModal = 'Editar Modal'
    this.idInputEdit = index
    this.showModal()
  }
  
  deleteInput(idInput){

    let array = this.arrayElements;    
    array == array.splice(idInput, 1);
    this.arrayElements = [];
    array.forEach(e => {
      this.arrayElements.push(e)
    });
    
  }

  

  
  //MODAL  
  
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false
    this.resetInputModal()
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

    this.api.c('REMOVE ITEM', data);

    switch (type) {
      case 'delete-element':
        this.modalService.confirm({
          nzTitle: 'Seguro que desea eliminar el elemento',
          nzContent: '',
          nzOkText: 'Si',
          nzOkType: 'danger',
          nzOnOk: () => this.deleteInput(data),
          nzCancelText: 'No',
          // nzOnCancel: () => console.log('Cancel')
        });
        break;

      default:
        break;
    }


  }


  //FILES

  handleFileInput(files: FileList, type) {
    this.fileToUpload = null;
    if(type == 'logo'){
      this.nameInputFileLogo = files.item(0).name;
    }else if(type == 'background'){
      this.nameInputFileBackground = files.item(0).name;
    }
    this.fileToUpload = files.item(0);

  }


  //EMITTER OUTPUT

  eventOutputApplink(e){
    switch (e.event) {
      case 'link-component':
        this.disabledSave = e.value
        this.dataInputsComponent = e.data
        break;
    
      default:
        break;
    }
  }

  //EVENTS ELEMENTS

  eventElements(e, data){

    switch (e) {
      case 'link':
        
        switch (data.typeLink) {
          case 'whatsapp':
            // https://api.whatsapp.com/send?phone=51954248962&text=Hola%20que%20tal

            const base_url = "https://api.whatsapp.com/send";
            let vars = {
              phone: data.inputValue,
              text: encodeURI(data.inputValue2),
            }
            let url = base_url + this.general.httpBuildQuery(vars)
            
            return {
              type: e,
              tag: 'a',
              href: url,
              name: data.inputName,
              originElements: data
            }

          case 'redirect':

            return {
              type: e,
              tag: 'a',
              href: data.inputValue,
              name: data.inputName,
              originElements: data
            }

            
          case 'tel':

            return {
              type: e,
              tag: 'a',
              href: 'tel:+' + data.inputValue,
              name: data.inputName,
              originElements: data
            }

          case 'email':

            return {
              type: e,
              tag: 'a',
              href: 'mailto:' + data.inputValue,
              name: data.inputName,
              originElements: data
            }            

          default:
            break;
        }

        
        break;
    
      default:
        break;
    }

  }




}
