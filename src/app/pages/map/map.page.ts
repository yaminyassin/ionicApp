import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ServiceService } from '../../services/service.service'

import * as L from 'leaflet';
import 'leaflet-routing-machine';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: L.Map;
  lat: number;
  lng: number;
  markerPos:L.Marker;
  features:L.FeatureGroup;
  
  //making fab btns only appear when map move:
  isVisable: boolean;

  constructor(private service:ServiceService) {
    this.isVisable = false;
    this.features = new L.FeatureGroup();
  }
   
  ngOnInit(){
    this.loadMap();
  }


  private loadMap():void{
    setTimeout(() => {
      this.getCurrentPos();
      let latLng =  L.latLng(this.lat, this.lng);

      let mapOpt = {
        center: latLng,
        zoom: 15,
        attributionControl: false,
        zoomControl:false
      }

      this.map = L.map('map', mapOpt);
      let layer = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
      this.map.addLayer(layer); 
      
    }, 1000);
  }


  public async getCurrentPos(){
    try {
      let position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000
      });

      this.isVisable =false;
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      let latlng =  L.latLng(this.lat , this.lng);

      if(this.markerPos != undefined){
        this.map.removeLayer(this.markerPos);
      }

      this.markerPos = L.marker(latlng, {});
      this.map.addLayer(this.markerPos).panTo(latlng, {
        animate:true,
        duration:0.5 
      }).on('mouseup', () => this.isVisable=true,);

    } catch (error) {
      console.log(error.message);
    }
  }

  

  public async getData(){
    let obj:any;
    
    for(let i=0; i<this.features.getLayers().length; i++){
      this.map.removeLayer(this.features.getLayers()[i]);
    }

    this.service.getParks(this.lat, this.lng)
    .subscribe((parks) => {
      let data:any = parks;
      let layer:any;

      data.forEach(park => {
          obj = this.buildGeoJSON(park.ocupado, park.geo);

          layer = L.geoJSON(obj, {style: this.style(obj)} );
          this.features.addLayer(layer);
          this.features.getLayer(this.features.getLayerId(layer))
          .addTo(this.map)
          .bindPopup(`${park.ocupado}% de lugares ocupados`); 
      });

      this.map.fitBounds(this.features.getBounds(), {animate:true, duration:1});
      


    });
      
  }

  private buildGeoJSON(ocupados:any, geo:any): JSON{
    let str =`{"type": "Feature",
      "properties": { "ocupado": ${ocupados}},
      "geometry": ${geo}}`;
    return JSON.parse(str);
  }

  private getColor(d:any):string{
    return (d>0 && d<=50)? '#00e600' :
           (d>50 && d<=80) ? '#ffff00' :
           '#e60000';
  }

  private style(feature:any){
    return {
        fillColor: this.getColor(feature.properties.ocupado),
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.60
    };
  }

}