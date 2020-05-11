import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ApiService } from './../services/api.service';

@Directive({
  selector: '[appRightclick]'
})
export class RightclickDirective {

  constructor(private el:ElementRef, private api: ApiService) { }

  @HostListener('contextmenu', ['$event']) onRightClick(event) {
    event.preventDefault();

    this.api.c('Click Derecho', event.target)

  }

}
