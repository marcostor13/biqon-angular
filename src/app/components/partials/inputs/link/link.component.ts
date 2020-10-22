import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from './../../../../services/api.service';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  //MODELS

  typeLink: any = null
  valueLink: any = null
  changing: Boolean = false
  inputName: any = null
  inputValue: any = null
  inputValue2: any = null

  @Output() dataOutput = new EventEmitter<any>();
  @Input() data: any; 

  constructor(private api: ApiService) {
    
   }

  ngOnInit(): void {

    this.getElements()

  }

  getElements(){
    if (this.data) {
      this.inputName = this.data.inputName
      this.inputValue = this.data.inputValue
      this.inputValue2 = this.data.inputValue2
      this.typeLink = this.data.typeLink
      this.valueLink = this.data.valueLink
      this.validate()
    }
    
  }


  validate(){

    this.api.c('validate link', '1')

    if (this.inputName !== null && this.inputValue !== null){
      this.dataOutput.emit({
        event: 'link-component',
        value: false,
        data: {
          typeLink: this.typeLink,
          valueLink: this.valueLink,
          inputName: this.inputName,
          inputValue: this.inputValue,
          inputValue2: this.inputValue2
        }
      });
    }else{
      this.dataOutput.emit({
        event: 'disabled-button-modal',
        value: true,
        data: null
      });
    }

  }

  

}
