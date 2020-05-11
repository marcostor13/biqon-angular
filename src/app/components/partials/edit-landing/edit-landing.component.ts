import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NzModalService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import * as $ from 'jquery-ui';
import { element } from 'protractor';

declare let $: any;

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
  backgroundImage: String = ''

  //INPUTS STYLES

  isVisibleStyles: Boolean = false
  disabledSaveStyles: Boolean = true
  titleModalStyles: String = 'Editar estilos'
  inputsStyles: any = []

  //INPUTS

  name = new FormControl('')
  logoUrl = new FormControl('')
  logoUpload = new FormControl('')
  backgroundImageUpload = new FormControl('')
  opacity = new FormControl('')
  backgroundColor = new FormControl('')

  //PADDING MARGIN

  paddingTop: any = '0';
  paddingBottom: any = '0';
  paddingLeft: any = '0';
  paddingRight: any = '0';
  marginTop: any = '0';
  marginBottom: any = '0';
  marginLeft: any = '0';
  marginRight: any = '0';

  //SECCTIONS

  sections:any = [];
  

  constructor(public route: ActivatedRoute, private router: Router, private api: ApiService, private cookie: CookieService, private modalService: NzModalService, private general: GeneralService) {
    this.id = this.route.snapshot.paramMap.get('id')
   }

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login-landing')
    if (this.id != '0'){
      this.titlePage = 'Editar landing'
    }   
    this.getCookieDataLanding();
    this.eventsJquery()

  }

  eventsJquery(){
    var self = this
    //Todos los elementos arrastrables
    $(".draggable").draggable({ revert: true, helper: "clone" })

    //Dropable seccion
    $(".droppable").droppable({
      activeClass: "activeClass",
      hoverClass: "hoverClass",
      drop: function (event, ui) {
        event.preventDefault()
        self.addElement(ui.draggable[0].innerText)
      }

    })

  }

  addElement(e){
    this.api.c('addElement', e)

    switch (e) {
      case 'Sección':

        if(this.sections.length === 0){
          this.sections.push({
            id: 'section_' + this.general.getRandomArbitrary(1000,9999),
            elements: [],
            styles: []
          })
        }


        this.api.c('addElement sección', this.sections)

        
        break;
    
      default:
        break;
    }


  }


  getCookieDataLanding(){
    let cookieDataLanding = this.cookie.get('data-landing')
    if (cookieDataLanding && cookieDataLanding != '') {
      this.backgroundColor.setValue(JSON.parse(this.cookie.get('data-landing')).backgroundColor)
      this.name.setValue(JSON.parse(this.cookie.get('data-landing')).name)
      this.opacity.setValue(JSON.parse(this.cookie.get('data-landing')).opacity)
      this.backgroundImage = JSON.parse(this.cookie.get('data-landing')).backgroundImage
      this.arrayElements = (JSON.parse(this.cookie.get('data-landing')).arrayElements) ? JSON.parse(this.cookie.get('data-landing')).arrayElements : []
    }
    this.api.c('arrayElements', this.arrayElements)
  }

  //INPUTS 

  saveCookieInputsElements(){
    var dataLanding = {
      backgroundColor: this.backgroundColor.value,
      name: this.name.value,
      opacity: this.opacity.value,
      backgroundImage: this.backgroundImage,
      arrayElements: this.arrayElements,
    }
    this.cookie.set('data-landing', JSON.stringify(dataLanding))
  }

  saveInput(){   

    if (this.idInputEdit !== null){ //EDIT ELEMENT BY INDEX
      this.arrayElements[this.idInputEdit] = this.eventElements(this.element, this.dataInputsComponent) 
      this.handleCancel();     
    }else{  //ADD NEW ELEMENT
      this.arrayElements.push(this.eventElements(this.element, this.dataInputsComponent)) 
    }
    
    this.saveCookieInputsElements()

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

    this.saveCookieInputsElements()
    
  }

  editStyles(data){
    let styles = (data.styles) ? data.styles : [] 
    this.getInputsStyles(data.tag, data.id, styles)
    this.showModalStyles()
  }

  getInputsStyles(tag, id, styles){
    this.inputsStyles = []
    switch (tag) {
      case 'a':    
        var arrayStyles = ['background-color', 'color', 'padding']    
      break   
    } 

    arrayStyles.forEach(e => {
      var elementStyles = this.general.searchElementByNameKey(styles, 'prop', e)
      var value = (elementStyles) ? elementStyles.value : ''

      if(e == 'padding'){
        if(value && value != ''){
          let v = value.split(' ');
          if(v.length > 1){
            this.paddingTop = v[0].replace('px','')
            this.paddingRight = v[1].replace('px','')
            this.paddingBottom = v[2].replace('px','')
            this.paddingLeft = v[3].replace('px','')
          }
        }else{
          this.paddingTop = '0'
          this.paddingRight = '0'
          this.paddingBottom = '0'
          this.paddingLeft = '0'
        }
      }

      if(e == 'margin'){
        if(value && value != ''){
          let v = value.split(' ');
          if(v.length > 1){
            this.marginTop = v[0].replace('px','')
            this.marginRight = v[1].replace('px','')
            this.marginBottom = v[2].replace('px','')
            this.marginLeft = v[3].replace('px','')
          }
        } else {
          this.marginTop = '0'
          this.marginRight = '0'
          this.marginBottom = '0'
          this.marginLeft = '0'
        }
      }

      this.inputsStyles.push({
        id: id,
        prop: e,
        value: value
      })
    });   
  }

  saveInputsStyles(id, prop, value){

    this.api.c('saveInputsStyles', value)
    for (let i = 0; i < this.arrayElements.length; i++) {
      if (this.arrayElements[i].id === id){
        if (!this.arrayElements[i].styles){
          this.arrayElements[i].styles = []
        }

        let indexProp = this.general.searchIndexByNameKey(this.arrayElements[i].styles, 'prop', prop) // BUSCA SI YA EXISTE LA PROPIEDAD
        if (indexProp !== false){
          this.arrayElements[i].styles[indexProp] = {
            prop: prop,
            value: value
          }
        }else{
          this.arrayElements[i].styles.push({
            prop: prop,
            value: value
          })           
        }
        break
      }      
    }
    this.saveCookieInputsElements()
  }

  getStyles(styles){
    var arrayStyles = {}
    for (let i = 0; i < styles.length; i++) {      
      arrayStyles[styles[i].prop] = styles[i].value      
    }    
    return arrayStyles
  }

  

  
  //MODAL  
  
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false
    this.resetInputModal()
  }

  showModalStyles(): void {
    this.isVisibleStyles = true;
  }

  handleCancelStyles(): void {
    this.isVisibleStyles = false
    // this.resetInputModalStyles()
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

    let id = Math.floor(Math.random() * 1000);

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
              id: 'a_' + id,
              type: e,
              tag: 'a',
              href: url,
              name: data.inputName,
              originElements: data
            }

          case 'redirect':

            return {
              id: 'a_' + id,
              type: e,
              tag: 'a',
              href: data.inputValue,
              name: data.inputName,
              originElements: data
            }

            
          case 'tel':

            return {
              id: 'a_' + id,
              type: e,
              tag: 'a',
              href: 'tel:+' + data.inputValue,
              name: data.inputName,
              originElements: data
            }

          case 'email':

            return {
              id: 'a_' + id,
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
