import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ServiceService } from '../../services/service.service';
import { DatastreamService } from '../../services/datastream.service';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { ThrowStmt } from '@angular/compiler';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {

  @ViewChild('map') mapDiv: ElementRef; 

  map: L.Map;
  lat: number;
  lng: number;

  markerPos:L.Marker;   //userPosition

  origin:L.LatLng;        
  desination:L.LatLng;    

  features:L.FeatureGroup; //list of parks inside map
  
  isVisable: boolean;    //making fab btns only appear when map move:

  drawerState: boolean = false;
  sentparks: L.GeoJSON[] = [];

  constructor(
    private service:ServiceService,
    private stream:DatastreamService,
    private element: ElementRef,
    private renderer: Renderer2) 
    {
    this.isVisable = false;
    this.features = new L.FeatureGroup();
    }
    
  ngAfterViewInit(){
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
      }).on('mouseup', () => this.isVisable=true);

    } catch (error) {
      console.log(error.message);
    }
  }

  

  public async getData(){
    let obj:any;
    this.features.removeFrom(this.map);
    this.features = new L.FeatureGroup();

    this.service.getParks(this.lat, this.lng)
    .subscribe((parks) => {
      let data:any = parks;
      let layer:any;

      data.forEach( park => {

          obj = this.buildGeoJSON(park.ocupado, park.geo);

          this.sentparks.push(obj); //array que envia parks ao component

          layer = L.geoJSON(obj, {style: this.style(obj)} );
         
          this.features.addLayer(layer).addTo(this.map).on("click", ev =>{

            this.map.fitBounds(ev.layer.getBounds(), 
            {
              animate:true,
              duration:1
            });

          });
         
      });

      this.sendData(this.sentparks);
      
      this.map.fitBounds(this.features.getBounds(), 
      {
        animate:true,
        duration:1,
        maxZoom:15
      });
      
      /*  
      var routing = L.Routing.control({
        waypoints: [
            L.latLng(38.7743744 ,-9.1062272),
            L.latLng(38.785903,-9.110801)
        ],
        routeWhileDragging: false,
        
      }).addTo(this.map);
      */

    }); 
  }

  getRoute(){
    this.origin = this.markerPos.getLatLng();
    
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

 
  public getDrawerState(state: boolean){
    this.drawerState = state;
    this.Animations();
  }

  public sendData(data: any){
    this.stream.changeData(data);
  }

  private Animations(){
    this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');
    if(this.drawerState){
      this.renderer.setStyle(this.mapDiv.nativeElement, "height", "40%");
    }else{
      this.renderer.setStyle(this.mapDiv.nativeElement, "height", "100%");
    }
    setTimeout(() =>{this.map.invalidateSize();}, 600);
   
  }
 
}