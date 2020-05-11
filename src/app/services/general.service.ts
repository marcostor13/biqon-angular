import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  httpBuildQuery(params) {
    if (typeof params === 'undefined' || typeof params !== 'object') {
      params = {};
      return params;
    }

    var query = '?';
    var index = 0;

    for (var i in params) {
      index++;
      var param = i;
      var value = params[i];
      if (index == 1) {
        query += param + '=' + value;
      } else {

        query += '&' + param + '=' + value;
      }

    }
    return query;
  }

  searchElementByNameKey(array, key, value){
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element[key] == value){
        return element
      }      
    }
  }

  searchIndexByNameKey(array, key, value) {
    var res:any = false;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element[key] == value) {
        res =  i
      }
    }

    return res
  }

  getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }


}
