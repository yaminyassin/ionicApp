import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  url = 'http://localhost:3000/';
  data:any;
  constructor(private http: HttpClient) {}
  
  getParks(lat:number, long:number){
    return this.http.get(`${this.url}movel/parksnearme/${lat}/${long}`);
  }

  getParkById(id: number){
    return this.http.get(`${this.url}movel/parkInfo/${id}`);
  }

  getMoreParks(lat:number, long:number, dist:number){
    return this.http.get(`${this.url}movel/parksnearme/${lat}/${long}/${dist}`)
  }


}
