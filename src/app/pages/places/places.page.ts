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
  parks:any[];

  constructor(private service:ServiceService) {}

  ngOnInit() {
    this.parks = [];
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
        this.parks.push( this.buildGeoJSON(e.ocupado, e.geo, e.dist)); 
      });
      console.log(this.parks);
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
      this.service.getMoreParks(this.lat, this.lng, this.parks[this.parks.length-1].properties.dist)
      .subscribe( (places) => {
        let data:any =places;
        data.forEach( e => {
          this.parks.push( this.buildGeoJSON(e.ocupado, e.geo, e.dist));
        });
      }); 
      event.target.complete();
      console.log(this.parks);

      if(this.parks.length  >= 20){
        event.target.disabled = true;
      }
     
    }, 1000);
    
  }
  
}