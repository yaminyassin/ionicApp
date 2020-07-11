import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { PopoverController} from '@ionic/angular';
import { PopoverCategories } from 'src/app/components/popover-categories/popover-categories.component';
import { ServiceService } from '../../services/service.service';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-promos',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage implements OnInit {
  lat:number;
  lng:number;
  notifs:any[];
  category:string;
  constructor(
    private service:ServiceService,
    private popoverController:PopoverController) {}

  ngOnInit() {
    this.notifs = [];
    this.loadData();
    this.category = "All";
  }
  

  async loadData(){
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
    this.service.getNotifs(this.lat, this.lng)
    .subscribe( (notifs) => {
      let data:any = notifs;
      data.forEach(e => { 
          if(this.category == "All" || this.category == e.category)
            this.notifs.push( this.buildJSON( e.name, e.category, e.note, e.date_end, e.dist)); 
        });
    });

  }

  loadMoreNotifs(event:any){  //-------------------
    setTimeout(()=>{
      this.service.getMoreNotifs(this.lat, this.lng, this.notifs[this.notifs.length-1].dist)
      .subscribe( (notifs) => {
        let data:any = notifs;
        data.forEach( e => {
          if(this.category == "All" || this.category == e.category)
            this.notifs.push( this.buildJSON(e.name, e.category, e.note, e.date_end, e.dist));
        });
      }); 

      event.target.complete();
      console.log(this.notifs);

      if(this.notifs.length  >= 20){
        event.target.disabled = true;
      }

    }, 1000);
  }

  private buildJSON(name:string, category:string, note:string, date_end:string, dist:number): JSON{ //--------------
    let modifiedDate = date_end.split("T")[0];

    let str =`{"name":"${name}","category":"${category}", "note":"${note}", "date_end":"${modifiedDate}", "dist":"${dist}"}`;
    return JSON.parse(str);
  }


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

    this.notifs = [];
    this.loadData();
  }

}
