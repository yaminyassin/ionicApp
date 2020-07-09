import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* DATA SHARING BETWEEN MAP AND SLIDE DRAWER*/
@Injectable({
  providedIn: 'root'
})
export class DatastreamService {
  private dataSource = new BehaviorSubject<any>([]);
  
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeData(data:any){
    this.dataSource.next(data);
  }
}
