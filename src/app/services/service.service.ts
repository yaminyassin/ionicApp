import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { links } from '../links';


@Injectable({
  providedIn: 'root'
})
export class ServiceService{
  url:string = links.url;
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

  getPlaces(lat:number, long:number){
    return this.http.get(`${this.url}movel/placesnearme/${lat}/${long}`);
  }

  getMorePlaces(lat:number, long:number, dist:number){
    return this.http.get(`${this.url}movel/placesnearme/${lat}/${long}/${dist}`)
  }

  getNotifs(lat:number, long:number){
    return this.http.get(`${this.url}movel/notifs/${lat}/${long}`);
  }

  getMoreNotifs(lat:number, long:number, dist:number){
    return this.http.get(`${this.url}movel/notifs/${lat}/${long}/${dist}`)
  }

  getCategories(){
    return this.http.get(`${this.url}movel/categories`);
  }


}
