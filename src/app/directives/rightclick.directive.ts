import { Directive, ElementRef, HostListener, Input, Output, EventEmitter} from '@angular/core';
import { ApiService } from './../services/api.service';

@Directive({
  selector: '[appRightclick]'
})
export class RightclickDirective {

  @Output() emitterRigthClick = new EventEmitter();

  constructor(private el:ElementRef, private api: ApiService) { }

  @HostListener('contextmenu', ['$event']) onRightClick(event) {
    event.preventDefault();

    this.emitterRigthClick.emit(event);

  }

}
