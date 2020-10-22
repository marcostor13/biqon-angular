import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NzModalService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import * as $ from 'jquery-ui';
import { element } from 'protractor';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  //GENERAL STYLES

  generalStyles:any = {
    backgroundColor: '',
    opacity: '',
    backgroundImage: ''
  } 


  //DRAG AND DROP

  idEventDrag: any; 

  //MENU

  menuElement: any = {}
  menuElementIsVisible:Boolean = false
  

  //COOKIE

  cookieDataLanding: any = null; 

  //HREF

  typeHref = new FormControl('whatsapp')
  typeLink: Boolean = false;
  hrefValue1: any = '';
  hrefValue2: any = '';
  

  constructor(public route: ActivatedRoute, private router: Router, private api: ApiService, private cookie: CookieService, private modalService: NzModalService, private general: GeneralService) {
    this.id = this.route.snapshot.paramMap.get('id')
   }

  ngOnInit(): void {
    this.user = this.api.validateSessionOnlyAdmin('login-landing')
    if (this.id != '0'){
      this.titlePage = 'Editar landing'
    }   
    this.getCookieDataLanding();

  }

  getGeneralStyles(){
    this.api.c('OPACITY', { "background-color": "rgba(0, 0, 0, " + this.opacity.value + ")" })
    this.generalStyles.opacity = { "background-color": "rgba(0, 0, 0, " + this.opacity.value + ")" }
    this.generalStyles.backgroundColor = { "background-color": this.backgroundColor.value }
  }

  getCookieDataLanding(){
    
    this.cookieDataLanding = this.cookie.get('data-landing')
    if (this.cookieDataLanding && this.cookieDataLanding != '') {
      this.cookieDataLanding = JSON.parse(this.cookieDataLanding)
      this.backgroundColor.setValue(this.cookieDataLanding.backgroundColor)
      this.name.setValue(this.cookieDataLanding.name)
      this.opacity.setValue(this.cookieDataLanding.opacity)
      this.backgroundImage = this.cookieDataLanding.backgroundImage
      this.sections = (this.cookieDataLanding.sections) ? this.cookieDataLanding.sections : []
    }
    this.getGeneralStyles()
    this.api.c('cookieDataLanding', this.cookieDataLanding)
  }

  //INPUTS 

  saveCookieInputsElements(){
    this.api.c('saveCookieInputsElements', 'saved!')
    var dataLanding = {
      backgroundColor: this.backgroundColor.value,
      name: this.name.value,
      opacity: this.opacity.value,
      backgroundImage: this.backgroundImage,
      sections: this.sections,
    }
    this.getGeneralStyles()
    this.cookie.set('data-landing', JSON.stringify(dataLanding))
  }

  editStyles(data, sectionId = null){
    let styles = (data.styles) ? data.styles : [] 
    this.getInputsStyles(data.tag, data.id, styles, sectionId)
    this.showModalStyles()
  }

  getInputsStyles(tag, id, styles, sectionId){    

    this.inputsStyles = []
    switch (tag) {
      case 'a':    
        var arrayStyles = ['background-color', 'color', 'border-radius', 'padding', 'margin',  'href']    
      break 
      case 'section':
        var arrayStyles = ['background-color', 'padding', 'margin','min-height', 'min-width']
        break  
    } 

    arrayStyles.forEach(e => {
      var elementStyles = this.general.searchElementByNameKey(styles, 'prop', e)
      var value = (elementStyles) ? elementStyles.value : ''

      this.api.c('getInputsStyles values', value)

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

      if (e == 'href'){

        if(value.indexOf('mailto')>-1){
          this.typeHref.setValue('email')
          this.hrefValue1 = value.replace('mailto:', '')          
        }else if(value.indexOf('tel')>-1){
          this.typeHref.setValue('phone')
          this.hrefValue1 = value.replace('tel:', '')
        }else if(value.indexOf('api.whatsapp')){
          this.typeHref.setValue('whatsapp')

          this.api.c('getInputsStyles href', value)

          let elements = this.general.getParametersURL(value)
          this.hrefValue1 = elements[0].value
          this.hrefValue2 = elements[1].value
        }else{
          this.typeHref.setValue('redirect')
          this.hrefValue1 = value
        }



        let indexSection = this.general.searchIndexByNameKey(this.sections, 'id', sectionId)
        let indexElement = this.general.searchIndexByNameKey(this.sections[indexSection].elements, 'id', id)
        value = this.sections[indexSection].elements[indexElement].href
      }


      this.inputsStyles.push({
        sectionId: sectionId,
        id: id,
        prop: e,
        value: value
      })
    });   
  }

  saveInputsStyles(elem, value){

    if(elem.sectionId === null){  //ESTA EDITANDO LA SECCIöN
      let indexSection = this.general.searchIndexByNameKey(this.sections, 'id', elem.id)
      this.api.c('saveInputsStyles', this.sections[indexSection])
      let indexProp = this.general.searchIndexByNameKey(this.sections[indexSection].styles, 'prop', elem.prop);
  
      if (indexProp){
        this.sections[indexSection].styles[indexProp].value = value; 
      }else{
        this.sections[indexSection].styles.push({
          prop: elem.prop,
          value: value
        })
      }
  
      this.api.c('saveInputsStyles', this.sections)      
    }else{   // ESTA EDITANDO UN ELEMENTO DE LA SECCIÓN  
      this.api.c('saveInputsStyles elements', elem)
      let indexSection = this.general.searchIndexByNameKey(this.sections, 'id', elem.sectionId)
      let indexElement = this.general.searchIndexByNameKey(this.sections[indexSection].elements, 'id', elem.id)
      let indexProp = this.general.searchIndexByNameKey(this.sections[indexSection].elements[indexElement].styles, 'prop', elem.prop)

      if (indexProp) {
        this.sections[indexSection].elements[indexElement].styles[indexProp].value = value;
      } else {
        this.sections[indexSection].elements[indexElement].styles.push({
          prop: elem.prop,
          value: value
        })
      }


    }

    this.saveCookieInputsElements()
  }

  saveInputsPropieties(type, elem, value){
    this.api.c('saveInputsPropieties href', value)
    let indexSection = this.general.searchIndexByNameKey(this.sections, 'id', elem.sectionId)
    let indexElement = this.general.searchIndexByNameKey(this.sections[indexSection].elements, 'id', elem.id)    
    switch (type) {
      case 'href':    
        this.sections[indexSection].elements[indexElement].href = value
        break;    
      default:
        break;
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
    // this.resetInputModal()
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
        // this.modalService.confirm({
        //   nzTitle: 'Seguro que desea eliminar el elemento',
        //   nzContent: '',
        //   nzOkText: 'Si',
        //   nzOkType: 'danger',
        //   nzOnOk: () => this.deleteInput(data),
        //   nzCancelText: 'No',
        //   // nzOnCancel: () => console.log('Cancel')
        // });
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
    this.api.c('eventOutputApplink', e)
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

  getHref(elem){

    var href = ''; 
       
      switch (this.typeHref.value) {
        case 'whatsapp':
          // https://api.whatsapp.com/send?phone=51954248962&text=Hola%20que%20tal

          if (this.hrefValue1 != '' && this.hrefValue1 != ''){
            const base_url = "https://api.whatsapp.com/send";
            let vars = {
              phone: this.hrefValue1,
              text: encodeURI(this.hrefValue1),
            }
            href = base_url + this.general.httpBuildQuery(vars)    
          }
          break;  
        case 'redirect':
          href = this.hrefValue1
          break;   
        case 'phone':
          href = 'tel:+' + this.hrefValue1
          break;          
        case 'email':
          href = 'mailto:' + this.hrefValue1
          break;         
        
      }

      this.api.c('getHref', href)

      if(href != ''){
        this.saveInputsPropieties('href', elem, href)
      }


  }



  // drag and drop

  allowDropSection(ev){
    if (this.idEventDrag != 'section') {
      ev.preventDefault();
      $(ev.target).addClass('activeSection')      
    } else {
      ev.stopPropagation();
    }
  }

  allowDropSeparator(ev){

    if (this.idEventDrag == 'section'){
      ev.preventDefault();
      $(ev.target).addClass('separationSectionDragOver')  
    }else{
      ev.stopPropagation();
    }

  }

  drag(ev) {
    this.api.c('drag', ev)  
    this.idEventDrag = ev.target.id; 
    switch (this.idEventDrag) {
      case 'section':      
        $('.separationSection').addClass('separationSectionActive')    
        break;
      case 'link':
        $('.section').addClass('hoverClass')
        break;
    
      default:
        break;
    }
  }  

  dragLeave(ev){
    this.api.c('dragLeave', ev)  
    switch (this.idEventDrag) {
      case 'section':
        $(ev.target).removeClass('separationSectionDragOver');        
        break;
      case 'link':
        $(ev.target).removeClass('activeSection') 
        break;

      default:
        break;
    }
  }

  dragend(ev){
    this.api.c('dragend', ev)  
    switch (this.idEventDrag) {
      case 'section':
        $('.separationSection').removeClass('separationSectionActive')       
        break;
      case 'link':
        $('.section').removeClass('hoverClass')
        break;
      

      default:
        break;
    }
    
  }

  //DROPS 

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    this.api.c('drop', this.idEventDrag)
    switch (this.idEventDrag) {
      case 'section':
        $('.separationSection').removeClass('separationSectionActive')
        $('.separationSection').removeClass('separationSectionDragOver')   
        break;
      case 'link':
        $('.section').removeClass('hoverClass')
        $('.section').removeClass('activeSection')
        
        break;
      default:
        break;
    }

    this.addElement(this.idEventDrag, ev)
  }
  

  //EVENTS DROP

  
  addElement(e, data:any = false) {
    this.api.c('addElement', e)

    switch (e) {
      case 'section':

        if (this.sections.length === 0) {
          this.sections.push({
            id: 'section_' + this.general.getRandomArbitrary(1000, 9999),
            elements: [],
            tag: 'section',
            styles: [
              {
                prop: 'min-height',
                value: '70px'
              },
              {
                prop: 'min-width',
                value: '100%'
              }
            ]
          })
        }else{
          if (data){
            let indexPosPrev = this.general.getIndexToId($(data.target).attr('id'))
            this.api.c('addElement else', indexPosPrev)
            let newSection = {
              id: 'section_' + this.general.getRandomArbitrary(1000, 9999),
              elements: [],
              tag: 'section',
              styles: [
                {
                  prop: 'min-height',
                  value: '70px'
                },
                {
                  prop: 'min-width',
                  value: '100%'
                }
              ]
            }

            this.sections = this.general.insertObjectInPositionArray(newSection, this.sections, indexPosPrev)
          }
        }
        this.api.c('addElement sección', this.sections)

        break;

      case 'link':

        let indexSection = this.general.searchIndexByNameKey(this.sections, 'id', data.target.id)
        let random = this.general.getRandomArbitrary(1000, 9999)
        this.sections[indexSection].elements.push({
          id: 'link_' + random,          
          name: 'Enlace_' + random,
          href: '#',
          tag: 'a',
          styles: []
        })

        this.api.c('addElement link', this.sections)
      break

      default:
        break;
    }

    this.saveCookieInputsElements()


  }


  //MENUELEMENT

  menuElementEvent(e){
    this.api.c('menuElementEvent',e)

    let type = e.target.getAttribute('data-type'); 
    
    switch (type) {
      case 'section':
        this.menuElement = {
          options: ['Editar', 'Eliminar'],
          id: e.target.id,
          styles: [
            {prop: 'top', value: e.pageY + 'px'},
            {prop: 'left', value: e.pageX + 'px'}          
          ],
          type: type,
        }
        this.api.c('menuElement', this.menuElement )
        this.openMenuElement()
        break;
      case 'link':
        this.menuElement = {
          options: ['Editar', 'Eliminar'],
          id: e.target.id,
          parentId: e.target.parentElement.id,
          styles: [
            { prop: 'top', value: e.pageY + 'px' },
            { prop: 'left', value: e.pageX + 'px' }
          ],
          type: type,
        }
        this.api.c('menuElement', this.menuElement)
        this.openMenuElement()
        break;
    
      default:
        this.closeMenuElement();
        break;
    }

  }

  openMenuElement(){    

    this.api.c('openMenuElement', 'openMenuElement')

    this.menuElementIsVisible = true
  }

  closeMenuElement(){
    this.menuElementIsVisible = false
  }

  editElement(elem){
    this.api.c('editElement', elem)

    switch (elem.type) {
      case 'section':
        let element = this.general.searchElementByNameKey(this.sections, 'id', elem.id)
        this.api.c('editElement section', element)
        this.editStyles(element)
        break;
      case 'link':
        let section = this.general.searchElementByNameKey(this.sections, 'id', elem.parentId)
        let link = this.general.searchElementByNameKey(section.elements, 'id', elem.id)
        this.api.c('editElement link', link)
        this.editStyles(link, elem.parentId)
        break;
    
      default:
        break;
    }

    this.closeMenuElement()
    
  }

  deleteElement(elem) {
    this.api.c('deleteElement', elem)
    switch (elem.type) {
      case 'section':
        this.sections = this.general.deleteElementOfArray(elem.id, this.sections)
        this.handleCancelStyles()
        this.api.c('deleteElementSection', this.sections)
        break;
      case 'link':
        this.sections = this.general.deleteElementOfArrayintoArray(elem.parentId, elem.id ,this.sections)
        this.handleCancelStyles()
        this.api.c('deleteElementSection', this.sections)
        break;

      default:
        break;
    }

    this.closeMenuElement()
    this.saveCookieInputsElements()

  }



}
