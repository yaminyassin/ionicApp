import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {
  lat:number;
  lng:number;
  places:any[];

  constructor(private service:ServiceService) {}

  ngOnInit() {
    this.places = [];
    this.loadData();
  }

  async loadData() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000
      });

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
     } catch(err) {
        console.log(err);
    }
   
    this.service.getParks(this.lat, this.lng)
    .subscribe( (places) => {
      let data:any =places;
      data.forEach( e => { 
        this.places.push( this.buildGeoJSON(e.ocupado, e.geo, e.dist)); 
      });
      console.log(this.places);
    });
  }

  private buildGeoJSON(ocupados:any, geo:any, dist:any): JSON{
    let str =`{"type": "Feature",
      "properties": { "ocupado": ${ocupados}, "dist": ${dist}},
      "geometry": ${geo}}`;
    return JSON.parse(str);
  }

  loadMoreParks(event:any){
    setTimeout(()=>{
      this.service.getMoreParks(this.lat, this.lng, this.places[this.places.length-1].properties.dist)
      .subscribe( (places) => {
        let data:any =places;
        data.forEach( e => {
          this.places.push( this.buildGeoJSON(e.ocupado, e.geo, e.dist));
        });
      }); 
      
      event.target.complete();
      console.log(this.places);

      if(this.places.length  >= 20){
        event.target.disabled = true;
      }
     
    }, 1000);
    
  }
  
}