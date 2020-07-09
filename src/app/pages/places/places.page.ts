import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Plugins } from '@capacitor/core';
import { PopoverController } from '@ionic/angular';
import { PopoverCategories } from 'src/app/components/popover-categories/popover-categories.component';

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
  image:any = '../../assets/Food.png';
  category:any;

  constructor(private service:ServiceService,
              private popoverController:PopoverController) {}

  ngOnInit() {
    this.places = [];
    this.loadData();
    this.category =  "All";
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
   
    this.service.getPlaces(this.lat, this.lng)
    .subscribe( (places) => {
      let data:any = places;
      data.forEach(e => { 
          if(this.category == "All" || this.category == e.category)
            this.places.push( this.buildGeoJSON(e.photo_path, e.name, e.about, e.category, e.geo, e.dist)); ///-----------
        });
    });
  }

  private buildGeoJSON(photo_path:string, name:string, about:string, category:string, geo:any, dist:number): JSON{ //--------------
    let img;
    if(category == "Food"){
      img ='../../assets/Food.png';
    }else if(category == "Pharmacy"){
      img ='../../assets/Pharmacy.png';
    }else if(category == "Supermarket"){
      img = '../../assets/Supermarket.png';
    }
    let str =`{"type": "Feature",
      "properties": {"photo_path":"${img}", "name":"${name}", "about":"${about}", "category":"${category}", "dist":"${dist}"},
      "geometry": ${geo}}`;
    return JSON.parse(str);
  }

  loadMorePlaces(event:any){  //-------------------
    setTimeout(()=>{
      this.service.getMorePlaces(this.lat, this.lng, this.places[this.places.length-1].properties.dist)
      .subscribe( (places) => {
        let data:any = places;
        data.forEach( e => {
          if(this.category == "All" || this.category == e.category)
            this.places.push( this.buildGeoJSON(e.photo_path, e.name, e.about, e.category, e.geo, e.dist));
        });
      }); 

      event.target.complete();
      console.log(this.places);

      if(this.places.length  >= 20){
        event.target.disabled = true;
      }
     
    }, 1000);
    
  }


  //popover para escolher a categoria

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverCategories,
      event: ev,
      translucent: false,
      backdropDismiss:false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    this.category = data;
    console.log("parent = "+ this.category) ;

    this.places = [];
    this.loadData();
  }
  
}