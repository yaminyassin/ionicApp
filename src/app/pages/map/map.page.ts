import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { ServiceService } from '../../services/service.service';
import { DatastreamService } from '../../services/datastream.service';
import { RoutingPlaceService } from '../../services/routing-place.service';

import * as L from 'leaflet';
import 'leaflet-routing-machine';



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
  desination:any;    
  routing:L.Routing.Control;

  features:L.FeatureGroup; //list of parks inside map
  
  isVisable:boolean;    //making fab btns only appear when map move:

  drawerState:boolean = false;
  sentparks:L.Layer[] = [];

  chosenPlace:any;  //variavel que recebe o place escolhido
  isPlaceSelected:boolean;

  OSRM:string = 'http://35.242.135.13:80/route/v1';
  MAP:string = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';

  constructor(
    private service:ServiceService,
    private stream:DatastreamService,
    private placeStream:RoutingPlaceService,
    private element: ElementRef,
    private renderer: Renderer2,
    private toastController: ToastController) 
    {
    this.isVisable = false;
    this.features = new L.FeatureGroup();
    }
    
  ngAfterViewInit(){
    this.loadMap();
    this.placeStream.currentData.subscribe(data => this.chosenPlace = data);
    this.placeStream.selectedPlace.subscribe(value => this.isPlaceSelected = value);
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
      let layer = new L.TileLayer(this.MAP);
      this.map.addLayer(layer); 
      
    }, 800);
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
    this.sentparks = [];

    this.service.getParks(this.lat, this.lng).subscribe((parks) => {
      let data:any = parks;
      let layer:L.Layer;

      data.forEach( park => {
        obj = this.buildGeoJSON(park.ocupado, park.geo, park.nfreespots, park.dist);

        //array que envia parks ao component
        this.sentparks.push(park);
        
        layer = L.geoJSON(obj, {style: this.style(obj)} );
        this.features.addLayer(layer).addTo(this.map).on("click", ev =>{
          
          this.map.fitBounds( ev.layer.getBounds(), 
          {
            animate:true,
            duration:1
          });
        });
      });
      
      //Evia o array com os parques 
      this.sendData(this.sentparks);
      this.presentToast('Swipe up to see Parks', 'success', "top");
      this.map.fitBounds( this.features.getBounds(), 
      {
        animate:true,
        duration:1,
        maxZoom:15
      });
    }); 
  }

  private buildGeoJSON(ocupados:any, geo:any, nfreespots:any, dist:number): JSON{
    let str =`{"type": "Feature",
      "properties": { "ocupado": ${ocupados}, "nfreespots":"${nfreespots}", "dist":"${dist}"},
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
  private Animations(){
    this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');

    if(this.drawerState){
      this.renderer.setStyle(this.mapDiv.nativeElement, "height", "37%");
    }
    else{
      this.renderer.setStyle(this.mapDiv.nativeElement, "height", "93%");
      if(this.features.getLayers().length != 0 || this.sentparks.length !=0){
        this.features.removeFrom(this.map);
        this.features = new L.FeatureGroup();
        this.sentparks = [];
        this.presentToast('Cancelled', 'danger', "middle");
      }
      if(this.routing != undefined){
        this.routing.remove();
      }
      this.map.panTo(this.markerPos.getLatLng());
    }
  }
 
/*----- Data Sharing Functions -----*/
  public getPlaceRoute(){
    this.origin = this.markerPos.getLatLng();
    this.desination = L.geoJSON(this.chosenPlace).getBounds().getCenter();
    let waypoints = [this.origin, this.desination];

    if( this.routing != undefined ){ this.routing.remove(); }
     
    
    this.routing = L.Routing.control(
    {
      router: L.Routing.osrmv1({ serviceUrl: this.OSRM }),

      plan: L.Routing.plan(waypoints, {
        draggableWaypoints:false,
        addWaypoints:false
      }),

      routeWhileDragging: false,
      waypoints: waypoints,
      lineOptions: {addWaypoints:false},
      
    }).addTo(this.map);

    this.isPlaceSelected = false;
    this.presentToast('Route Calculated', 'success', "bottom");
    this.map.fitBounds(L.latLngBounds(waypoints), 
    {padding: [50, 50]});
 
  }
  public getRoute(value:Object){
    console.log("parent recieved: " + value);

    let route:any = value;

    let obj:any = this.buildGeoJSON(route.ocupado, route.geo, route.nfreespots, route.dist);

    this.origin = this.markerPos.getLatLng();
    this.desination = L.geoJSON(obj, {style: this.style(obj)} ).getBounds().getCenter();
    let waypoints = [this.origin, this.desination];

    if( this.routing != undefined ){ this.routing.remove(); }
     
    
    this.routing = L.Routing.control(
    {
      router: L.Routing.osrmv1({ serviceUrl: this.OSRM }),

      plan: L.Routing.plan(waypoints, {
        draggableWaypoints:false,
        addWaypoints:false
      }),

      routeWhileDragging: false,
      waypoints: waypoints,
      lineOptions: {addWaypoints:false},
      
    }).addTo(this.map);

    this.presentToast('Route Calculated', "success", "bottom");
    this.map.fitBounds(L.latLngBounds(waypoints), 
    {padding: [50, 50]});

 
  }

  public getDrawerState(state: boolean){
    console.log("parent recieved: "+ state);
    this.drawerState = state;
    this.Animations();
    
    setTimeout(() =>{this.map.invalidateSize();}, 800);
  }

  public sendData(data: any){
    this.stream.changeData(data);
  }
 
  async presentToast(text:string, color:string, position) {
    const toast = await this.toastController.create({
      message: text,
      color:color,
      position:position,
      duration: 800
    });
    toast.present();
  }
}