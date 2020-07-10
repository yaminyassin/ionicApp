import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
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

  constructor() { }

  ngOnInit() {
    this.notifs = [];
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

    //CONTINUAR AQUI (TENHO DE CRIAR
    // A QUERY PARA ESTA PAGINA)
  }

}
