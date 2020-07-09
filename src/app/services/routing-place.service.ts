import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingPlaceService {

  private messageSource = new BehaviorSubject<any>('');
  private place= new BehaviorSubject<boolean>(false);

  currentData = this.messageSource.asObservable();
  selectedPlace = this.place.asObservable();
  
  constructor() { }

  changeData(data:any){
    this.messageSource.next(data);
  }

  isPlaceSelected(value:boolean){
    this.place.next(value)
  }
}
